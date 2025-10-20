// Fichier: backend/src/profile/profile.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateUserProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');

    if (user.recruiterProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData };
      
      delete dataToUpdate.coverLetterText;

      await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: {
          ...dataToUpdate,
          searchedCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
        include: {
          searchedCategories: true, // ✅ Inclure les catégories dans la réponse
        }
      });
    } else if (user.candidateProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData };

      await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...dataToUpdate,
          interestedInCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
        include: {
          interestedInCategories: true, // ✅ Inclure les catégories dans la réponse
        }
      });
    } else {
      throw new NotFoundException('Aucun profil à mettre à jour trouvé pour cet utilisateur.');
    }

    return this.getUserProfile(userId); // ✅ Retourne maintenant les catégories
  }

  /**
   * Met à jour la localisation GPS d'un candidat.
   * @param userId L'ID de l'utilisateur provenant du token JWT.
   * @param locationDto Les coordonnées GPS.
   */
  async updateUserLocation(userId: string, locationDto: UpdateLocationDto) {
    // FIX : On cherche l'utilisateur par son 'id'.
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { candidateProfile: true },
    });

    if (!user.candidateProfile) {
      throw new NotFoundException('Profil candidat non trouvé pour cet utilisateur.');
    }

    const locationWKT = `POINT(${locationDto.longitude} ${locationDto.latitude})`;

    // La validation PostGIS est une bonne pratique, on la garde.
    try {
      await this.prisma.$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      throw new BadRequestException('Coordonnées GPS invalides');
    }

    return this.prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: { locationWKT },
    });
  }

  /**
   * Met à jour la localisation GPS d'un recruteur.
   * @param userId L'ID de l'utilisateur provenant du token JWT.
   * @param locationDto Les coordonnées GPS.
   */
  async updateRecruiterLocation(userId: string, locationDto: UpdateLocationDto) {
    // FIX : On cherche l'utilisateur par son 'id'.
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { recruiterProfile: true },
    });

    if (!user.recruiterProfile) {
      throw new NotFoundException('Profil recruteur non trouvé pour cet utilisateur.');
    }

    const locationWKT = `POINT(${locationDto.longitude} ${locationDto.latitude})`;

    return this.prisma.recruiterProfile.update({
      where: { id: user.recruiterProfile.id },
      data: { locationWKT },
    });
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