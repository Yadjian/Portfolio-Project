// Fichier: backend/src/profile/profile.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileStorageService } from 'src/file-storage/file-storage.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private fileStorageService: FileStorageService,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: {
          include: {
            interestedInCategories: true, // ✅ Ajouter les catégories du candidat
          },
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
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
    return user;
  }

  async updateUserProfile(
    userId: string,
    data: UpdateProfileDto,
    photoFile?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');

    // ✅ Gestion de l'upload de photo
    let photoUrlData = {};
    if (photoFile) {
      // 🔒 Validation souple côté service
      if (photoFile.size > 3 * 1024 * 1024) {
        console.warn(`Large photo upload: ${photoFile.size} bytes`);
        // Ne pas bloquer, juste logger
      }

      const url = await this.fileStorageService.uploadFile(
        photoFile,
        'profile-photos',
      );
      photoUrlData = { photoUrl: url };
    }

    if (user.recruiterProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...photoUrlData }; // ✅ Ajout photo

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
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...photoUrlData }; // ✅ Ajout photo

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

  /**
   * Met à jour la localisation GPS d'un candidat.
   * @param userId L'ID de l'utilisateur provenant du token JWT.
   * @param locationDto Les coordonnées GPS.
   */
  async updateUserLocation(userId: string, locationDto: UpdateLocationDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { candidateProfile: true },
    });

    if (!user.candidateProfile) {
      throw new NotFoundException(
        'Profil candidat non trouvé pour cet utilisateur.',
      );
    }

    const { locationName, locationWKT } = locationDto;

    // 🔒 Validation PostGIS avec gestion d'erreur souple
    try {
      await this.prisma
        .$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      console.warn('PostGIS validation error:', error.message);
      throw new BadRequestException(
        'Coordonnées GPS invalides. Vérifiez le format.',
      );
    }

    return this.prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: {
        locationWKT,
        locationName: locationName,
      },
    });
  }

  /**
   * Met à jour la localisation GPS d'un recruteur.
   * @param userId L'ID de l'utilisateur provenant du token JWT.
   * @param locationDto Les coordonnées GPS.
   */
  async updateRecruiterLocation(
    userId: string,
    locationDto: UpdateLocationDto,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { recruiterProfile: true },
    });

    if (!user.recruiterProfile) {
      throw new NotFoundException(
        'Profil recruteur non trouvé pour cet utilisateur.',
      );
    }

    const { locationName, locationWKT } = locationDto;

    // 🔒 Validation PostGIS identique
    try {
      await this.prisma
        .$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      console.warn('PostGIS validation error for recruiter:', error.message);
      throw new BadRequestException(
        'Coordonnées GPS invalides. Vérifiez le format.',
      );
    }

    return this.prisma.recruiterProfile.update({
      where: { id: user.recruiterProfile.id },
      data: {
        locationWKT,
        locationName: locationName, // 🔧 CORRECTION BUG : locationName → city
      },
    });
  }

  // 🔧 MÉTHODE PRINCIPALE CORRIGÉE
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    photoFile?: Express.Multer.File,
  ) {
    // 1. Trouver le profil de l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    let profileModel: any;
    let profileId: string;

    if (user.candidateProfile) {
      profileModel = this.prisma.candidateProfile;
      profileId = user.candidateProfile.id;
    } else if (user.recruiterProfile) {
      profileModel = this.prisma.recruiterProfile;
      profileId = user.recruiterProfile.id;
    } else {
      throw new NotFoundException('Profil non trouvé.');
    }

    // 2. Gérer l'upload de la photo (si elle est fournie)
    let photoUrlData = {};
    if (photoFile) {
      // 🔒 Validation souple - log mais ne bloque pas
      if (photoFile.size > 3 * 1024 * 1024) {
        console.warn(
          `Large photo upload: ${photoFile.size} bytes for user ${userId}`,
        );
      }

      const url = await this.fileStorageService.uploadFile(
        photoFile,
        'profile-photos',
      );
      photoUrlData = { photoUrl: url };
    }

    // 3. 🔧 CORRECTION BUG - Gestion dynamique des catégories
    let categoriesData = {};
    if (dto.interestedInCategoryIds && dto.interestedInCategoryIds.length > 0) {
      // 🔧 FIX : Détermine le bon nom de champ selon le profil
      const categoryFieldName = user.candidateProfile
        ? 'interestedInCategories'
        : 'searchedCategories';

      categoriesData = {
        [categoryFieldName]: {
          // ✅ CORRECTION : Clé dynamique
          set: dto.interestedInCategoryIds.map((id) => ({ id: id })),
        },
      };

      // On enlève le champ du DTO pour ne pas qu'il soit passé tel quel
      delete dto.interestedInCategoryIds;
    }

    // 4. Mettre à jour la BDD
    return profileModel.update({
      where: { id: profileId },
      data: {
        ...dto, // Applique les champs de texte
        ...photoUrlData, // Applique la nouvelle photoUrl
        ...categoriesData, // Applique les catégories avec le bon nom de champ
      },
    });
  }

  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateResume(userId: string, file: Express.Multer.File) {
    // 🔒 Validation souple côté service
    if (file.size > 7 * 1024 * 1024) {
      console.warn(
        `Large resume upload: ${file.size} bytes for user ${userId}`,
      );
      // Ne pas bloquer complètement, juste logger
    }

    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }

    const fileUrl = await this.fileStorageService.uploadFile(file, 'resumes');

    const updatedProfile = await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: { resumeUrl: fileUrl },
    });

    return {
      message: 'CV mis à jour avec succès.',
      resumeUrl: updatedProfile.resumeUrl,
    };
  }

  async deleteResume(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }

    await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: { resumeUrl: null },
    });

    return {
      message: 'CV supprimé avec succès.',
    };
  }

  // 🔒 PUSH TOKEN avec validation souple
  async updatePushToken(userId: string, token: string | null) {
    // 🔒 Validation souple du token
    if (token && (token.length < 5 || token.length > 2000)) {
      console.warn(
        `Suspicious push token length: ${token.length} for user ${userId}`,
      );
      // Ne pas bloquer, juste logger
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    if (user.candidateProfile) {
      return this.prisma.candidateProfile.update({
        where: { userId },
        data: { pushToken: token },
      });
    } else if (user.recruiterProfile) {
      return this.prisma.recruiterProfile.update({
        where: { userId },
        data: { pushToken: token },
      });
    }
    throw new NotFoundException('Profil non trouvé.');
  }

  async updateProfilePhoto(
    userId: string,
    photoFile: Express.Multer.File,
  ): Promise<any> {
    // 🔒 Validation souple
    if (photoFile.size > 3 * 1024 * 1024) {
      console.warn(
        `Large profile photo: ${photoFile.size} bytes for user ${userId}`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const photoUrl = await this.fileStorageService.uploadFile(
      photoFile,
      'profile-photos',
    );

    if (user.candidateProfile) {
      const updatedProfile = await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: { photoUrl },
      });
      return { photoUrl: updatedProfile.photoUrl };
    } else if (user.recruiterProfile) {
      const updatedProfile = await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: { photoUrl },
      });
      return { photoUrl: updatedProfile.photoUrl };
    } else {
      throw new ForbiddenException("L'utilisateur n'a pas de profil actif");
    }
  }
}
