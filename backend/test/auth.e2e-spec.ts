import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('Auth E2E (Real DB)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const testEmail = 'lucas.boyadjian@gmail.com';
  const testPassword = 'Password123';
  let accessToken: string;

  beforeAll(async () => {
    // Nettoyer la DB avant les tests
    await prisma.user.deleteMany({ where: { email: testEmail } }).catch(() => {});
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Nettoyer la DB après les tests
    await prisma.user.deleteMany({ where: { email: testEmail } }).catch(() => {});
    await prisma.$disconnect();
    await app.close();
  });

  it('should POST a valid signup', () => {
    authServiceMock.signup.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'lucas.boyadjian@gmail.com',
        password: 'Password123',
        role: 'CANDIDATE',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });
  });

  it('should return 409 when the email already exists', () => {
    authServiceMock.signup.mockRejectedValue(
      new ConflictException('Un utilisateur avec cet email existe déjà.'),
    );

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'lucas.boyadjian@gmail.com',
        password: 'Password123',
        role: 'CANDIDATE',
      })
      .expect(409)
      .expect((res) => {
        expect(res.body.message).toBe('Un utilisateur avec cet email existe déjà.');
      });
  });

  it('should return 400 for invalid passwords', async () => {
    const cases = [
      {
        password: '123',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
      },
      {
        password: 'password123',
        message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.',
      },
      {
        password: 'P'.repeat(73),
        message: 'Le mot de passe ne peut pas dépasser 72 caractères',
      },
    ];

    for (const c of cases) {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'lucas.boyadjian@gmail.com',
          password: c.password,
          role: 'CANDIDATE',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(c.message);
    }
  });

  it('should POST a valid login', () => {
    authServiceMock.login.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'lucas.boyadjian@gmail.com',
        password: 'Password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });
  });

  it('should return 401 when the password is invalid', () => {
    authServiceMock.login.mockRejectedValue(
      new UnauthorizedException('Identifiants incorrects.'),
    );

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'lucas.boyadjian@gmail.com',
        password: 'WrongPassword',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Identifiants incorrects.');
      });
  });
});