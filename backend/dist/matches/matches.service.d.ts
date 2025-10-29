import { PrismaService } from 'src/prisma/prisma.service';
export declare class MatchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllMatches(userId: string): Promise<({
        matchId: string;
        matchedAt: Date;
        profile: {
            companyName: string;
            searchedJobTitle: string;
            contractType: import("@prisma/client").$Enums.ContractType;
            id: string;
            firstName: string;
            lastName: string;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
            searchedCategories: {
                name: string;
            }[];
            memberships: ({
                company: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                recruiterId: string;
                internalRole: string;
                isPrimary: boolean;
                companyId: string;
            })[];
        };
    } | {
        matchId: string;
        matchedAt: Date;
        profile: {
            contractType: import("@prisma/client").$Enums.ContractType;
            id: string;
            firstName: string;
            lastName: string;
            photoUrl: string;
            desiredJobTitle: string;
            desiredContractTypes: import("@prisma/client").$Enums.ContractType[];
        };
    })[]>;
    getMatchDetails(userId: string, swipeId: string): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            siret: string;
            logoUrl: string | null;
        };
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        locationWKT: string | null;
        locationName: string | null;
        isActive: boolean;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        companyId: string;
        title: string;
        description: string;
        salaryMin: number | null;
        salaryMax: number | null;
        currency: string | null;
        workHours: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    })[] | ({
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
    })>;
}
