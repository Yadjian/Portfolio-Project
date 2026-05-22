import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, UserRole } from './dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    candidateProfile: {
      create: jest.fn(),
    },
    recruiterProfile: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should reject signup when the email already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.signup({
        email: 'lucas.boyadjian@gmail.com',
        password: 'Password123',
        role: UserRole.CANDIDATE,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should create a candidate account and return access and refresh tokens', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.$transaction.mockImplementation(async (transactionCallback) => {
      const transactionClient = {
        user: {
          create: jest.fn().mockResolvedValue({
            id: '1',
            email: 'lucas.boyadjian@gmail.com',
            role: UserRole.CANDIDATE,
          }),
        },
        candidateProfile: {
          create: jest.fn().mockResolvedValue({ id: '1' }),
        },
        recruiterProfile: {
          create: jest.fn(),
        },
      };

      return transactionCallback(transactionClient);
    });
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
    jwtServiceMock.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.signup({
      email: 'lucas.boyadjian@gmail.com',
      password: 'Password123',
      role: UserRole.CANDIDATE,
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'lucas.boyadjian@gmail.com' },
    });
    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should login successfully and return access and refresh tokens', async () => {
    const mockUser = {
      id: '1',
      email: 'lucas.boyadjian@gmail.com',
      password: 'hashed-password',
      role: UserRole.CANDIDATE,
    };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jwtServiceMock.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.login({
      email: 'lucas.boyadjian@gmail.com',
      password: 'Password123',
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'lucas.boyadjian@gmail.com' },
      select: { id: true, email: true, password: true, role: true },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashed-password');
    expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });

  it('should reject login when the password is invalid', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'lucas.boyadjian@gmail.com',
      password: 'hashed-password',
      role: UserRole.CANDIDATE,
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.login({ email: 'lucas.boyadjian@gmail.com', password: 'WrongPassword' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should reject signup when password does not meet backend rules', () => {
    const cases: Array<{ password: string; expected: string[] }> = [
      { password: '', expected: ['Le mot de passe ne peut pas être vide'] },
      { password: '123', expected: ['Le mot de passe doit contenir au moins 8 caractères.', 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'] },
      { password: 'password123', expected: ['Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'] },
      { password: 'PASSWORD123', expected: ['Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'] },
      { password: 'P'.repeat(73), expected: ['Le mot de passe ne peut pas dépasser 72 caractères'] },
    ];

    for (const c of cases) {
      const dto = plainToInstance(SignupDto, {
        email: 'lucas.boyadjian@gmail.com',
        password: c.password,
        role: UserRole.CANDIDATE,
      });

      const errors = validateSync(dto);
      const passwordError = errors.find((e) => e.property === 'password');
      expect(passwordError).toBeDefined();
      const messages = Object.values(passwordError?.constraints ?? {});
      for (const expectedMsg of c.expected) {
        expect(messages).toContain(expectedMsg);
      }
    }
  });
});