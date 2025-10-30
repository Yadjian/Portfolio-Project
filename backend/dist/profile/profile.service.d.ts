import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileStorageService } from 'src/file-storage/file-storage.service';
export declare class ProfileService {
    private readonly prisma;
    private fileStorageService;
    constructor(prisma: PrismaService, fileStorageService: FileStorageService);
    getUserProfile(userId: string): Promise<{
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
    updateUserProfile(userId: string, data: UpdateProfileDto, photoFile?: Express.Multer.File): Promise<{
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
    updateUserLocation(userId: string, locationDto: UpdateLocationDto): Promise<{
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
    updateRecruiterLocation(userId: string, locationDto: UpdateLocationDto): Promise<{
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
    updateProfile(userId: string, dto: UpdateProfileDto, photoFile?: Express.Multer.File): Promise<any>;
    getJobCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    updateProfilePhoto(userId: string, photoFile: Express.Multer.File): Promise<{
        photoUrl: string;
    }>;
    updateResume(userId: string, file: Express.Multer.File): Promise<{
        message: string;
        resumeUrl: string;
    }>;
    deleteResume(userId: string): Promise<{
        message: string;
    }>;
    updatePushToken(userId: string, token: string | null): Promise<{
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
