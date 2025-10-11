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
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    if (!user) throw new NotFoundException('User not found.');
    
    // Séparez les IDs de catégories du reste des données du profil
    const { interestedInCategoryIds, ...profileData } = data;

    if (user.candidateProfile) {
      return this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...profileData, // Met à jour les champs simples (firstName, lastName, etc.)
          
          // Syntaxe Prisma pour mettre à jour une relation plusieurs-à-plusieurs
          interestedInCategories: {
            // "set" remplace la liste existante par cette nouvelle liste
            set: interestedInCategoryIds?.map((id) => ({ id: id })) || [],
          },
        },
      });
    } else if (user.recruiterProfile) {
      // Pour l'instant, on ne met à jour que les champs simples pour le recruteur
      return this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: profileData,
      });
    } else {
      throw new NotFoundException('No profile found to update.');
    }
  }
}
