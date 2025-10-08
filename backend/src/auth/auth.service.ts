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

    // Si l'utilisateur n'existe pas, on le crée
    if (role === 'candidate') {
      // Pour un candidat, on peut créer l'utilisateur et le profil vide d'un coup
      this.logger.log(`Creating new user and candidate profile for ${auth0Id}`);
      return this.prisma.user.create({
        data: {
          auth0Id,
          email,
          candidateProfile: {
            create: { firstName: "Prénom", lastName: "Nom" },
          },
        },
        include: {
          candidateProfile: true,
          recruiterProfile: true,
        },
      });
    } else if (role === 'recruiter') {
      // Pour un recruteur, on ne crée QUE l'utilisateur. L'onboarding est géré ailleurs.
      this.logger.log(`Creating new user shell for recruiter ${auth0Id}`);
      return this.prisma.user.create({
        data: {
          auth0Id,
          email,
        },
        include: {
          candidateProfile: true,
          recruiterProfile: true,
        },
      });
    } else {
      throw new InternalServerErrorException(`Invalid role for new user: ${role}`);
    }
  }
}
