// Fichier: backend/src/auth/auth.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(payload: any) {
    const auth0Id = payload.sub; // 'sub' est l'ID unique d'Auth0
    const email = payload['https://mova.app/email']; // <-- On lit notre "custom claim"

    // Sécurité : Vérifier que l'email est bien présent
    if (!email) {
      throw new InternalServerErrorException('Email not found in token. Please add it via an Auth0 Action.');
    }

    // 1. Vérifier si l'utilisateur existe déjà
    const user = await this.prisma.user.findUnique({
      where: { auth0Id: auth0Id },
    });

    if (user) {
      // L'utilisateur existe, on le renvoie
      return user;
    }

    // 2. Si l'utilisateur n'existe pas, on le crée AVEC l'email
    const newUser = await this.prisma.user.create({
      data: {
        auth0Id: auth0Id,
        email: email, // <-- On fournit l'email à la base de données
      },
    });

    return newUser;
  }
}
