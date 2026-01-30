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

  // 🔒 INSCRIPTION SÉCURISÉE - Base sur votre logique existante
  async signup(
    dto: SignupDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, role } = dto;

    // 🔒 L'email est déjà normalisé par le Transform dans le DTO

    // ✅ VOTRE LOGIQUE EXISTANTE - Vérifier si l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    // 🔒 Hash sécurisé - passé de 10 à 12 rounds pour plus de sécurité
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ VOTRE TRANSACTION EXISTANTE - inchangée
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
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

    // ✅ VOTRE GÉNÉRATION DE TOKENS - inchangée
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  // 🔒 CONNEXION SÉCURISÉE - Base sur votre logique
  async login(
    dto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    // 🔒 L'email est déjà normalisé par le Transform dans le DTO

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // ✅ VOTRE GÉNÉRATION DE TOKENS - inchangée
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  // ✅ VOS MÉTHODES EXISTANTES - inchangées
  async logout(userId: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const tokensMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!tokensMatch) throw new ForbiddenException('Access Denied');

    const newTokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, newTokens.refreshToken);
    return newTokens;
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12); // 🔒 12 au lieu de 10
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
      jti: crypto.randomUUID(), // 🔒 ID unique pour le token
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
