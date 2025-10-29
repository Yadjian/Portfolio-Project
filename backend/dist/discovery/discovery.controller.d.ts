import { Request } from 'express';
import { DiscoveryService } from './discovery.service';
export declare class DiscoveryController {
    private readonly discoveryService;
    constructor(discoveryService: DiscoveryService);
    getRecruiterDiscoveryDeck(req: Request, radius: number): Promise<{
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
    getCandidateDiscoveryDeck(req: Request, radius: number): Promise<({
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
    getPendingCandidates(req: Request): Promise<({
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
