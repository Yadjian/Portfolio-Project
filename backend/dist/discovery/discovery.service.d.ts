import { PrismaService } from '../prisma/prisma.service';
export declare class DiscoveryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRecruitersForCandidate(userId: string, radiusInMeters?: number, coords?: {
        latitude: number;
        longitude: number;
    }): Promise<{
        companyName: string;
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
    }[]>;
    getCandidatesForRecruiter(userId: string, radiusInMeters?: number, coords?: {
        latitude: number;
        longitude: number;
    }): Promise<({
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
    })[]>;
    getPendingCandidatesForRecruiter(userId: string): Promise<({
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
    })[]>;
}
