import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<{
        role: string;
        candidateProfile: {
            firstName: string;
            lastName: string;
            coverLetterText: string;
            desiredJobTitle: string;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
            locationName: string;
            experienceLevel: import("@prisma/client").$Enums.ExperienceLevel;
            interestedInCategories: {
                id: string;
                name: string;
            }[];
        };
        recruiterProfile: {
            firstName: string;
            lastName: string;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
            locationName: string;
            searchDescription: string;
            desiredExperienceLevel: import("@prisma/client").$Enums.ExperienceLevel;
            searchedCategories: {
                id: string;
                name: string;
            }[];
            memberships: {
                company: {
                    name: string;
                    siret: string;
                };
            }[];
        };
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserById(id: string): Promise<{
        role: string;
        candidateProfile: {
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
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(dto: CreateUserDto): Promise<{
        role: string;
        candidateProfile: {
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
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        role: string;
        candidateProfile: {
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
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
