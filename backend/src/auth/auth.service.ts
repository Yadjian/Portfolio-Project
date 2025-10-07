// Fichier: backend/src/auth/auth.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async syncUser(payload: any) {
    const namespace = 'https://mova.app/';
    const auth0Id = payload.sub;
    const email = payload[namespace + 'email'];
    const role = payload[namespace + 'role']; // <-- On récupère le rôle !

    if (!email) {
      throw new InternalServerErrorException('Email not found in token.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { auth0Id },
    });

    if (existingUser) {
      this.logger.log(`User with auth0Id ${auth0Id} already exists.`);
      return existingUser;
    }

    // L'utilisateur n'existe pas, on le crée avec son profil.
    this.logger.log(`Creating new user for auth0Id ${auth0Id} with role ${role}.`);

    if (role !== 'candidate' && role !== 'recruiter') {
      throw new InternalServerErrorException(`Invalid or missing role in token: ${role}`);
    }

    const newUser = await this.prisma.user.create({
      data: {
        auth0Id,
        email,
        // Logique de création simplifiée grâce à vos modifications du schéma
        candidateProfile: role === 'candidate' ? {
          create: {
            firstName: "Prénom",
            lastName: "Nom",
            // Plus besoin de fournir desiredContractTypes, il est optionnel !
          }
        } : undefined,
        recruiterProfile: role === 'recruiter' ? {
          create: {
            firstName: "Prénom",
            lastName: "Nom",
          }
        } : undefined,
      },
      include: {
        candidateProfile: true,
        recruiterProfile: true,
      }
    });

    this.logger.log(`Successfully created user and ${role} profile.`);
    return newUser;
  }
}
