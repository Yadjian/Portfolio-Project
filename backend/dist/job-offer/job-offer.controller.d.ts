import type { Request } from 'express';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
export declare class JobOffersController {
    private readonly jobOfferService;
    constructor(jobOfferService: JobOfferService);
    create(createJobOfferDto: CreateJobOfferDto, req: Request): Promise<{
        company: {
            name: string;
            logoUrl: string;
        };
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        createdBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        locationWKT: string | null;
        locationName: string | null;
        isActive: boolean;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        title: string;
        description: string;
        workHours: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        companyId: string;
        currency: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    }>;
    findAll(): Promise<({
        company: {
            name: string;
            logoUrl: string;
        };
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
        createdBy: {
            firstName: string;
            lastName: string;
            memberships: ({
                company: {
                    name: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        locationWKT: string | null;
        locationName: string | null;
        isActive: boolean;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        title: string;
        description: string;
        workHours: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        companyId: string;
        currency: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    })[]>;
    findMyOffers(req: Request): Promise<({
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
        title: string;
        description: string;
        workHours: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        companyId: string;
        currency: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    })[]>;
    findOne(id: string): Promise<{
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
        createdBy: {
            user: {
                email: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        locationWKT: string | null;
        locationName: string | null;
        isActive: boolean;
        experienceLevel: import("@prisma/client").$Enums.ExperienceLevel | null;
        title: string;
        description: string;
        workHours: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        companyId: string;
        currency: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    }>;
    update(id: string, req: Request, updateJobOfferDto: UpdateJobOfferDto): Promise<{
        company: {
            name: string;
            logoUrl: string;
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
        title: string;
        description: string;
        workHours: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        companyId: string;
        currency: string | null;
        expiresAt: Date | null;
        contractType: import("@prisma/client").$Enums.ContractType;
        createdById: string;
    }>;
    remove(id: string, req: Request): Promise<void>;
}
