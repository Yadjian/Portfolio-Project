// Fichier: backend/src/profile/profile.service.ts

// This service handles all business logic related to user profile management,
// including viewing, updating, uploading photos/resumes, and updating location or push tokens.

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // Retrieves the full profile for a user, including candidate or recruiter details and categories
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        candidateProfile: {
          include: {
            interestedInCategories: true, // Include candidate's interested categories
          }
        }, 
        recruiterProfile: {
          include: {
            searchedCategories: true, // Include recruiter's searched categories
            memberships: {
              include: {
                company: true,
              },
            },
          },
        }
      },
    });
    if (!user) { throw new NotFoundException('User not found.'); }
    return user;
  }

  // Updates the user's profile (candidate or recruiter), including photo upload if provided
  async updateUserProfile(userId: string, data: UpdateProfileDto, photoFile?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    // Handle photo upload if a new photo is provided
    let photoUrlData = {};
    if (photoFile) {
      const url = await this.fileStorageService.uploadFile(photoFile, 'profile-photos');
      photoUrlData = { photoUrl: url };
    }

    // Update recruiter profile if user is a recruiter
    if (user.recruiterProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...photoUrlData };
      delete dataToUpdate.coverLetterText; // Remove candidate-only fields

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
    } 
    // Update candidate profile if user is a candidate
    else if (user.candidateProfile) {
      const { interestedInCategoryIds, ...restOfData } = data;
      const dataToUpdate: any = { ...restOfData, ...photoUrlData };

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
   * Updates the GPS location for a candidate profile.
   * @param userId The user's ID from the JWT token.
   * @param locationDto The new location data.
   */
  async updateUserLocation(userId: string, locationDto: UpdateLocationDto) {
    // Find the user by ID and include candidate profile
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { candidateProfile: true },
    });

    if (!user.candidateProfile) {
      throw new NotFoundException('Candidate profile not found for this user.');
    }

    const { locationName, locationWKT } = locationDto;

    // Validate the WKT format using PostGIS
    try {
      await this.prisma.$executeRaw`SELECT ST_GeomFromText(${locationWKT}, 4326)`;
    } catch (error) {
      throw new BadRequestException('Invalid GPS coordinates');
    }

    // Update the candidate profile with the new location
    return this.prisma.candidateProfile.update({
      where: { id: user.candidateProfile.id },
      data: { locationWKT, locationName },
    });
  }

  /**
   * Updates the GPS location for a recruiter profile.
   * @param userId The user's ID from the JWT token.
   * @param locationDto The new location data.
   */
  async updateRecruiterLocation(userId: string, locationDto: UpdateLocationDto) {
    // Find the user by ID and include recruiter profile
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { recruiterProfile: true },
    });

    if (!user.recruiterProfile) {
      throw new NotFoundException('Recruiter profile not found for this user.');
    }

    const { locationName, locationWKT } = locationDto;

    // Update the recruiter profile with the new location
    return this.prisma.recruiterProfile.update({
      where: { id: user.recruiterProfile.id },
      data: { locationWKT, locationName },
    });
  }

  // Main method for updating a profile, handling photo upload and category updates
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    photoFile?: Express.Multer.File,
  ) {
    // Find the user's profile (candidate or recruiter)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    let profileModel: any;
    let profileId: string;
    let oldPhotoUrl: string | null = null;

    if (user.candidateProfile) {
      profileModel = this.prisma.candidateProfile;
      profileId = user.candidateProfile.id;
      oldPhotoUrl = user.candidateProfile.photoUrl;
    } else if (user.recruiterProfile) {
      profileModel = this.prisma.recruiterProfile;
      profileId = user.recruiterProfile.id;
      oldPhotoUrl = user.recruiterProfile.photoUrl;
    } else {
      throw new NotFoundException('Profile not found.');
    }

    // Handle photo upload and delete old photo if necessary
    let photoUrlData = {};
    if (photoFile) {
      const url = await this.fileStorageService.uploadFile(
        photoFile,
        'profile-photos',
      );
      photoUrlData = { photoUrl: url };
      if (oldPhotoUrl) {
        await this.fileStorageService.deleteFileByUrl(oldPhotoUrl);
      }
    }

    // Handle category updates if provided
    let categoriesData = {};
    if (dto.interestedInCategoryIds) {
      // Use the correct field name based on profile type
      const categoryField = user.candidateProfile ? 'interestedInCategories' : 'searchedCategories';
      categoriesData = {
        [categoryField]: {
          set: dto.interestedInCategoryIds.map(id => ({ id: id })),
        },
      };
      delete dto.interestedInCategoryIds; 
    }

    // Update the profile in the database
    return profileModel.update({
      where: { id: profileId },
      data: {
        ...dto,
        ...photoUrlData,
        ...categoriesData,
      },
    });
  }

  // Retrieves all available job categories, ordered alphabetically
  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' }
    });
  }

  // Uploads or updates only the user's profile photo
  async updateProfilePhoto(userId: string, photoFile: Express.Multer.File) {
    // Find the user's profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Get the old photo URL to delete it after uploading the new one
    let oldPhotoUrl: string | null = null;
    if (user.candidateProfile) {
      oldPhotoUrl = user.candidateProfile.photoUrl;
    } else if (user.recruiterProfile) {
      oldPhotoUrl = user.recruiterProfile.photoUrl;
    }

    // Upload the new photo to R2
    const photoUrl = await this.fileStorageService.uploadFile(
      photoFile,
      'profile-photos',
    );

    // Update the profile with the new photo URL
    if (user.candidateProfile) {
      await this.prisma.candidateProfile.update({
        where: { id: user.candidateProfile.id },
        data: { photoUrl },
      });
    } else if (user.recruiterProfile) {
      await this.prisma.recruiterProfile.update({
        where: { id: user.recruiterProfile.id },
        data: { photoUrl },
      });
    } else {
      throw new NotFoundException('Profile not found.');
    }

    // Delete the old photo from R2 if it exists
    if (oldPhotoUrl) {
      await this.fileStorageService.deleteFileByUrl(oldPhotoUrl);
    }

    return { photoUrl };
  }

  // Uploads or updates the user's resume (PDF)
  async updateResume(userId: string, file: Express.Multer.File) {
    // Find the candidate profile
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Candidate profile not found.');
    }

    // Upload the new resume to R2
    const fileUrl = await this.fileStorageService.uploadFile(file, 'resumes');

    // Delete the old resume from R2 if it exists
    if (profile.resumeUrl) {
      await this.fileStorageService.deleteFileByUrl(profile.resumeUrl);
    }

    // Save the new resume URL in the database
    const updatedProfile = await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        resumeUrl: fileUrl,
      },
    });

    return {
      message: 'Resume updated successfully.',
      resumeUrl: updatedProfile.resumeUrl,
    };
  }

  // Deletes the user's resume from storage and database
  async deleteResume(userId: string) {
    // Find the candidate profile
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Candidate profile not found.');
    }

    // Delete the resume file from R2 if it exists
    if (profile.resumeUrl) {
      await this.fileStorageService.deleteFileByUrl(profile.resumeUrl);
    }

    // Remove the resume URL from the database
    await this.prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        resumeUrl: null,
      },
    });

    return {
      message: 'Resume deleted successfully.',
    };
  }

  // Updates the user's push notification token (for candidate or recruiter)
  async updatePushToken(userId: string, token: string | null) {
    // Find the user and their profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true, recruiterProfile: true },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.candidateProfile) {
        return this.prisma.candidateProfile.update({ where: { userId }, data: { pushToken: token } });
    } else if (user.recruiterProfile) {
        return this.prisma.recruiterProfile.update({ where: { userId }, data: { pushToken: token } });
    }
    throw new NotFoundException('Profile not found.');
  }
}
