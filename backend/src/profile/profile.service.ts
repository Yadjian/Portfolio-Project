// File: backend/src/profile/profile.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateLiveLocationDto } from './dto/update-live-location.dto';
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
            interestedInCategories: true, // Include candidate categories
          },
        },
        recruiterProfile: {
          include: {
            searchedCategories: true, // Include recruiter categories
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

    let photoUrlData = {};
    if (photoFile) {
      if (photoFile.size > 3 * 1024 * 1024) {
        console.warn(`Large photo upload: ${photoFile.size} bytes`);
      }

      const url = await this.fileStorageService.uploadFile(
        photoFile,
        'profile-photos',
      );
      photoUrlData = { photoUrl: url };
    }

    if (user.recruiterProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...photoUrlData }; // Include photo data

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
      const dataToUpdate: any = { ...restOfData, ...photoUrlData }; // Include photo data

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
   * Updates the GPS location of the authenticated profile, candidate or recruiter.
   * @param userId The user ID from the JWT token.
   * @param locationDto The GPS coordinates.
   */
  async updateUserLocation(userId: string, locationDto: UpdateLocationDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        candidateProfile: true,
        recruiterProfile: true,
      },
    });

    const { locationName, locationWKT } = locationDto;

    // Validate PostGIS input with graceful error handling
    try {
      await this.prisma
        .$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      console.warn(
        'PostGIS validation error:',
        error instanceof Error ? error.message : error,
      );
      throw new BadRequestException(
        'Coordonnées GPS invalides. Vérifiez le format.',
      );
    }

    if (user.candidateProfile) {
      return this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: {
          locationWKT,
          locationName,
        },
      });
    }

    if (user.recruiterProfile) {
      return this.updateRecruiterLocation(userId, locationDto);
    }

    throw new NotFoundException('Profil non trouvé pour cet utilisateur.');
  }

  /**
   * Updates the GPS location of a recruiter.
   * @param userId The user ID from the JWT token.
   * @param locationDto The GPS coordinates.
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

    // Validate PostGIS input with the same logic
    try {
      await this.prisma
        .$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      console.warn(
        'PostGIS validation error for recruiter:',
        error instanceof Error ? error.message : error,
      );
      throw new BadRequestException(
        'Coordonnées GPS invalides. Vérifiez le format.',
      );
    }

    return this.prisma.recruiterProfile.update({
      where: { id: user.recruiterProfile.id },
      data: {
        locationWKT,
        locationName: locationName,
      },
    });
  }

  async updateUserLiveLocation(
    userId: string,
    locationDto: UpdateLiveLocationDto,
  ) {
    const locationWKT = `POINT(${locationDto.longitude} ${locationDto.latitude})`;
    const updatedAt = new Date();

    try {
      await this.prisma.$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      console.warn(
        'PostGIS live location validation error:',
        error instanceof Error ? error.message : error,
      );
      throw new BadRequestException(
        'Coordonnées GPS live invalides. Vérifiez le format.',
      );
    }

    const candidateUpdated = await this.prisma.$executeRaw`
      UPDATE "CandidateProfile"
      SET "liveLocationWKT" = ${locationWKT}, "liveLocationUpdatedAt" = ${updatedAt}
      WHERE "userId" = ${userId}
    `;

    if (Number(candidateUpdated) > 0) {
      return {
        success: true,
        locationWKT,
        updatedAt,
      };
    }

    const recruiterUpdated = await this.prisma.$executeRaw`
      UPDATE "RecruiterProfile"
      SET "liveLocationWKT" = ${locationWKT}, "liveLocationUpdatedAt" = ${updatedAt}
      WHERE "userId" = ${userId}
    `;

    if (Number(recruiterUpdated) > 0) {
      return {
        success: true,
        locationWKT,
        updatedAt,
      };
    }

    throw new NotFoundException('Profil non trouvé pour cet utilisateur.');
  }

  // Main profile update method
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    photoFile?: Express.Multer.File,
  ) {
    // Find the user's profile
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

    // Handle photo upload when provided
    let photoUrlData = {};
    if (photoFile) {
      // Log oversized uploads without blocking the request
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

    // Build category relation data dynamically
    let categoriesData = {};
    if (dto.interestedInCategoryIds && dto.interestedInCategoryIds.length > 0) {
      // Choose the correct relation field based on the profile type
      const categoryFieldName = user.candidateProfile
        ? 'interestedInCategories'
        : 'searchedCategories';

      categoriesData = {
        [categoryFieldName]: {
          // Use a dynamic relation key
          set: dto.interestedInCategoryIds.map((id) => ({ id: id })),
        },
      };

      // Remove the DTO helper field before persistence
      delete dto.interestedInCategoryIds;
    }

    // Update the database record
    return profileModel.update({
      where: { id: profileId },
      data: {
        ...dto, // Apply text fields
        ...photoUrlData, // Apply the new photo URL
        ...categoriesData, // Apply categories using the correct field name
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
    // Soft validation at service level
    if (file.size > 7 * 1024 * 1024) {
      console.warn(
        `Large resume upload: ${file.size} bytes for user ${userId}`,
      );
      // Do not block the request, only log it
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

  // Push token update with soft validation
  async updatePushToken(userId: string, token: string | null) {
    // Soft token validation
    if (token && (token.length < 5 || token.length > 2000)) {
      console.warn(
        `Suspicious push token length: ${token.length} for user ${userId}`,
      );
      // Do not block the request, only log it
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
    // Soft validation
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
