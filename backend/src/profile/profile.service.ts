// Fichier: backend/src/profile/profile.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(auth0Id: string) {
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      // On utilise 'include' pour récupérer en même temps les profils liés
      include: {
        candidateProfile: true,
        recruiterProfile: true,
      },
      });
          // AJOUTEZ CES LIGNES :
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user; // <-- LA LIGNE "RETURN" MANQUANTE
  }

  async updateUserProfile(auth0Id: string, data: UpdateProfileDto) {
    // D'abord, on récupère l'utilisateur pour savoir quel profil mettre à jour
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // On met à jour le profil approprié
    if (user.candidateProfile) {
      return this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: data, // Le DTO correspond aux champs du profil
      });
    } else if (user.recruiterProfile) {
      return this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: data,
      });
    } else {
      throw new NotFoundException('No profile found to update.');
    }
  }
}
