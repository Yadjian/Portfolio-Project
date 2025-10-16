// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto, UserRole } from './dto/signup.dto';
import { AuthDto } from './dto/auth.dto'; // Nous créerons ce fichier DTO juste après

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

// --- INSCRIPTION (NOUVELLE VERSION) ---
  async signup(dto: SignupDto): Promise<{ accessToken: string; refreshToken:string }> {
    const { email, password, role } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    // On utilise une transaction pour s'assurer que le User ET le Profil sont créés
    const newUser = await this.prisma.$transaction(async (tx) => {
      // 1. Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      // 2. Créer le profil associé en fonction du rôle
      if (role === UserRole.CANDIDATE) {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            // Vous pouvez mettre des valeurs par défaut si nécessaire
            // Par exemple, firstName et lastName peuvent être vides au début
            firstName: 'Prénom à compléter',
            lastName: 'Nom à compléter',
          },
        });
      } else if (role === UserRole.RECRUITER) {
        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
            firstName: 'Prénom à compléter',
            lastName: 'Nom à compléter',
          },
        });
      }

      return user;
    });

    // Générer et retourner les tokens
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  // --- CONNEXION ---
  async login(dto: AuthDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    // V FIX: La condition était inversée. On ajoute '!'
    if (!isPasswordMatching) { 
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // Générer et retourner les tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }
  
  // --- DÉCONNEXION ---
  // V FIX: On ajoute le type de retour pour la fonction async
  async logout(userId: string): Promise<void> { 
    // Supprime le hash du refresh token de l'utilisateur
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }


  // --- HELPERS (fonctions utilitaires) ---

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m', // Courte durée de vie
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d', // Longue durée de vie
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
