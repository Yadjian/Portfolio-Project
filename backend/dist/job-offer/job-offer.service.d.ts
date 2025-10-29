import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
export declare class JobOfferService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createJobOfferDto: CreateJobOfferDto, userId: string): Promise<{
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
    update(id: string, userId: string, updateJobOfferDto: UpdateJobOfferDto): Promise<{
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
    remove(id: string, userId: string): Promise<void>;
    findAllByRecruiter(userId: string): Promise<({
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
    updateOffersForRecruiter(recruiterProfileId: string, data: Prisma.JobOfferUpdateInput): Promise<void>;
}
