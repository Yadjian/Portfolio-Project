// Fichier: backend/src/profile/profile.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeocodingService } from '../geocoding/geocoding.service'; // ✅ Ajout
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService, // ✅ Injection
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        candidateProfile: {
          include: {
            interestedInCategories: true, // ✅ Ajouter les catégories du candidat
          }
        }, 
        recruiterProfile: {
          include: {
            searchedCategories: true, // ✅ Ajouter les catégories du recruteur
            memberships: {
              include: {
                company: true,
              },
            },
          },
        }
      },
    });
    if (!user) { throw new NotFoundException('Utilisateur non trouvé.'); }
    return user;
  }

  /**
   * Met à jour le profil complet avec géocodage automatique si adresse fournie
   */
  async updateUserProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');

    // Géocodage automatique si adresse fournie
    let geocodedData = {};
    if (data.fullAddress) {
      geocodedData = await this.geocodingService.geocode(data.fullAddress);
    }

    if (user.recruiterProfile) {
      const { interestedInCategoryIds, fullAddress, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...geocodedData }; // ✅ Fusion
      
      delete dataToUpdate.coverLetterText;

      await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: {
          ...dataToUpdate,
          searchedCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
        include: { searchedCategories: true },
      });
    } else if (user.candidateProfile) {
      const { interestedInCategoryIds, fullAddress, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...geocodedData }; // ✅ Fusion

      await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...dataToUpdate,
          interestedInCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
        include: { interestedInCategories: true },
      });
    }

    return this.getUserProfile(userId);
  }

  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' }
    });
  }
}