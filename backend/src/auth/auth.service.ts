// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
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

    // 1. Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // 2. Si l'utilisateur existe, lever une erreur claire (HTTP 409 Conflict)
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // On utilise une transaction pour s'assurer que le User ET le Profil sont créés
    const newUser = await this.prisma.$transaction(async (tx) => {
      // 3. Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      // 4. Créer le profil associé en fonction du rôle
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

  async refreshTokens(userId: string, refreshToken: string) {
  // 1. Trouver l'utilisateur et son token haché actuel
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

  // 2. Vérifier que le refresh token fourni correspond à celui en base de données
  const tokensMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
  if (!tokensMatch) throw new ForbiddenException('Access Denied');

  // 3. Si tout est bon, on utilise votre "Usine à Tokens"
  const newTokens = await this.getTokens(user.id, user.email);

  // 4. On utilise votre "Coffre-fort" pour stocker le nouveau token
  await this.updateRefreshTokenHash(user.id, newTokens.refreshToken);

  // 5. On renvoie les nouveaux tokens
  return newTokens;
}

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
