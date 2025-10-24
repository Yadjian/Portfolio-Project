// Fichier: backend/src/profile/profile.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileStorageService } from 'src/file-storage/file-storage.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService,
              private fileStorageService: FileStorageService,
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

  async updateUserProfile(userId: string, data: UpdateProfileDto, photoFile?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');

    // ✅ Gestion de l'upload de photo
    let photoUrlData = {};
    if (photoFile) {
      const url = await this.fileStorageService.uploadFile(photoFile, 'profile-photos');
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
    // FIX : On cherche l'utilisateur par son 'id'.
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { candidateProfile: true },
    });

    if (!user.candidateProfile) {
      throw new NotFoundException('Profil candidat non trouvé pour cet utilisateur.');
    }

    // On utilise directement les données du DTO
    const { locationName, locationWKT } = locationDto;

    // La validation PostGIS est une bonne pratique, on la garde.
    try {
      await this.prisma.$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      throw new BadRequestException('Coordonnées GPS invalides');
    }

    return this.prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: { locationWKT, locationName }, // ✅ Corrigez ici : locationName → city
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

    const { locationName, locationWKT } = locationDto;

    return this.prisma.recruiterProfile.update({
      where: { id: user.recruiterProfile.id },
      data: { locationWKT, locationName }, // ✅ Corrigez ici : locationName → city
    });
  }

  // === LA MÉTHODE DE MISE À JOUR PRINCIPALE ===
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
      const url = await this.fileStorageService.uploadFile(
        photoFile,
        'profile-photos',
      );
      photoUrlData = { photoUrl: url };
    }

    // 3. Gérer les catégories (si elles sont fournies)
    let categoriesData = {};
    if (dto.interestedInCategoryIds) {
      categoriesData = {
        interestedInCategories: { // ou 'searchedCategories' pour le recruteur
          set: dto.interestedInCategoryIds.map(id => ({ id: id })),
        },
      };
      // On enlève le champ du DTO pour ne pas qu'il soit passé tel quel
      delete dto.interestedInCategoryIds; 
    }

    // 4. Mettre à jour la BDD
    return profileModel.update({
      where: { id: profileId },
      data: {
        ...dto,           // Applique les champs de texte (firstName, locationWKT, etc.)
        ...photoUrlData,  // Applique la nouvelle photoUrl (si elle existe)
        ...categoriesData, // Applique les catégories (si elles existent)
      },
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

  async updateResume(userId: string, file: Express.Multer.File) {
    // 1. Trouver le profil candidat
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }

    // 2. Envoyer le fichier à R2
    // On le stocke dans un dossier "resumes" avec un nom unique
    const fileUrl = await this.fileStorageService.uploadFile(file, 'resumes');

    // 3. Sauvegarder l'URL publique dans la BDD
    const updatedProfile = await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        resumeUrl: fileUrl,
      },
    });

    return {
      message: 'CV mis à jour avec succès.',
      resumeUrl: updatedProfile.resumeUrl,
    };
  }

    async deleteResume(userId: string) {
    // 1. Trouver le profil candidat
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }

    // 2. Supprimer l'URL du CV dans la BDD (on ne supprime pas le fichier R2 pour l'instant)
    await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        resumeUrl: null,
      },
    });

    return {
      message: 'CV supprimé avec succès.',
    };
  }
}