// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignupDto, UserRole } from './dto/signup.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Secure signup - based on existing logic
  async signup(
    dto: SignupDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, role } = dto;

   // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    // Secure hash 12 rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    //Existing transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (role === UserRole.CANDIDATE) {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            firstName: '',
            lastName: '',
          },
        });
      } else if (role === UserRole.RECRUITER) {
        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
            firstName: '',
            lastName: '',
          },
        });
      }

      return user;
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(
    dto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }
  async logout(userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRefreshToken: { not: null },
        },
        data: {
          hashedRefreshToken: null,
        },
      }),
      this.prisma.candidateProfile.updateMany({
        where: { userId },
        data: {
          liveLocationWKT: null,
          liveLocationUpdatedAt: null,
        },
      }),
      this.prisma.recruiterProfile.updateMany({
        where: { userId },
        data: {
          liveLocationWKT: null,
          liveLocationUpdatedAt: null,
        },
      }),
    ]);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      select: {
        id: true,
        email: true,
        hashedRefreshToken: true,
        role: true,
      },
    });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const tokensMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!tokensMatch) throw new ForbiddenException('Access Denied');

    const newTokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, newTokens.refreshToken);
    return newTokens;
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private async getTokens(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
      jti: crypto.randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
