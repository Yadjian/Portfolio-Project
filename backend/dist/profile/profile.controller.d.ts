import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: Request): Promise<{
        candidateProfile: {
            interestedInCategories: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            resumeUrl: string | null;
            photoUrl: string | null;
            coverLetterText: string | null;
            desiredJobTitle: string | null;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
            locationWKT: string | null;
            locationName: string | null;
            searchRadiusKm: number | null;
            isActive: boolean;
            notificationsEnabled: boolean;
            pushToken: string | null;
            experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
            userId: string;
        };
        recruiterProfile: {
            searchedCategories: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            }[];
            memberships: ({
                company: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    siret: string;
                    logoUrl: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                internalRole: string;
                isPrimary: boolean;
                recruiterId: string;
                companyId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            photoUrl: string | null;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
            locationWKT: string | null;
            locationName: string | null;
            pushToken: string | null;
            userId: string;
            internalRoleDefault: string | null;
            matchWindowStart: Date | null;
            matchesTodayCount: number;
            dailyMatchLimit: number;
            searchDescription: string | null;
            desiredExperienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        };
    } & {
        email: string;
        password: string;
        id: string;
        hashedRefreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: Request, updateProfileDto: UpdateProfileDto, photoFile?: Express.Multer.File): Promise<any>;
    updateLocation(req: Request, updateLocationDto: UpdateLocationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        resumeUrl: string | null;
        photoUrl: string | null;
        coverLetterText: string | null;
        desiredJobTitle: string | null;
        desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
        locationWKT: string | null;
        locationName: string | null;
        searchRadiusKm: number | null;
        isActive: boolean;
        notificationsEnabled: boolean;
        pushToken: string | null;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        userId: string;
    }>;
    getJobCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    uploadProfilePhoto(req: Request, photoFile: Express.Multer.File): Promise<{
        photoUrl: string;
    }>;
    uploadResume(req: Request, file: Express.Multer.File): Promise<{
        message: string;
        resumeUrl: string;
    }>;
    deleteResume(req: Request): Promise<{
        message: string;
    }>;
    updatePushToken(req: Request, token: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        resumeUrl: string | null;
        photoUrl: string | null;
        coverLetterText: string | null;
        desiredJobTitle: string | null;
        desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
        locationWKT: string | null;
        locationName: string | null;
        searchRadiusKm: number | null;
        isActive: boolean;
        notificationsEnabled: boolean;
        pushToken: string | null;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        userId: string;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        photoUrl: string | null;
        desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
        locationWKT: string | null;
        locationName: string | null;
        pushToken: string | null;
        userId: string;
        internalRoleDefault: string | null;
        matchWindowStart: Date | null;
        matchesTodayCount: number;
        dailyMatchLimit: number;
        searchDescription: string | null;
        desiredExperienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
    }>;
}
