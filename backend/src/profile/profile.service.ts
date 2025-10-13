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
      include: {
        // Pour un candidat, on inclut son profil simple
        candidateProfile: true,

        // Pour un recruteur, on va plus en profondeur pour récupérer l'entreprise
        recruiterProfile: { // <-- MODIFICATION 1 : Include imbriqué
          include: {
            memberships: { // Inclure les adhésions du recruteur
              include: {
                company: true, // Pour chaque adhésion, inclure l'entreprise
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async updateUserProfile(auth0Id: string, data: UpdateProfileDto) {
    // On récupère l'utilisateur pour savoir quel profil mettre à jour.
    // L'include ici est juste pour la condition, pas pour la réponse finale.
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    // --- MODIFICATION 2 : Logique de mise à jour ---

    if (user.candidateProfile) {
      const { interestedInCategoryIds, ...profileData } = data;
      // On attend la fin de la mise à jour, sans retourner son résultat
      await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...profileData,
          interestedInCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
      });

    } else if (user.recruiterProfile) {
      const { interestedInCategoryIds, experienceLevel, ...profileData } = data;
      // On attend la fin de la mise à jour, sans retourner son résultat
      await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: {
          ...profileData,
          desiredExperienceLevel: experienceLevel,
          searchedCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
      });
      
    } else {
      throw new NotFoundException('No profile found to update.');
    }

    // --- MODIFICATION 3 : La réponse unifiée ---

    // Après la mise à jour, on appelle notre méthode getUserProfile pour renvoyer l'objet complet.
    return this.getUserProfile(auth0Id);
  }
}
