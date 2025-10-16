// Fichier: backend/src/profile/profile.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    // ... (cette fonction est correcte et ne change pas)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) { throw new NotFoundException('Utilisateur non trouvé.'); }
    return user;
  }

  // --- VERSION FINALE CORRIGÉE ---
  async updateUserProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');

    if (user.recruiterProfile) {
      // FIX : On ne prend que les champs qui existent dans le DTO ET dans le modèle RecruiterProfile
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData };
      
      // On retire les champs spécifiques aux candidats qui pourraient être dans le DTO
      delete dataToUpdate.coverLetterText;

      await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: {
          ...dataToUpdate,
          searchedCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
      });
    } else if (user.candidateProfile) {
      // FIX : Logique similaire pour le candidat
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData };
      
      // On retire les champs spécifiques aux recruteurs qui pourraient être dans le DTO
      // (aucun dans ce cas, mais c'est une bonne pratique)

      await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          ...dataToUpdate,
          interestedInCategories: {
            set: interestedInCategoryIds?.map((id) => ({ id })),
          },
        },
      });
    } else {
      throw new NotFoundException('Aucun profil à mettre à jour trouvé pour cet utilisateur.');
    }

    return this.getUserProfile(userId);
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
}
