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

    if (user.candidateProfile) {
      const { interestedInCategoryIds, ...profileData } = data;
      return this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...profileData,
          interestedInCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })) || [],
          },
        },
      });

    } else if (user.recruiterProfile) {
      const { interestedInCategoryIds, ...profileData } = data; // On réutilise le même champ du DTO
      return this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: {
          ...profileData,
          // On mappe les champs du DTO vers les bons champs du modèle RecruiterProfile
          desiredExperienceLevel: data.experienceLevel, 
          searchedCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })) || [],
          },
        },
      });

    } else {
      throw new NotFoundException('No profile found to update.');
    }
  }
}
