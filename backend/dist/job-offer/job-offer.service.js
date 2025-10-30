"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOfferService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobOfferService = class JobOfferService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createJobOfferDto, userId) {
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            include: {
                memberships: { include: { company: true } },
                searchedCategories: true,
            },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found.');
        }
        if (!recruiterProfile.memberships?.length) {
            throw new common_1.ForbiddenException('You must be associated with a company.');
        }
        if (!recruiterProfile.searchedCategories?.length || !recruiterProfile.desiredContractTypes?.length || !recruiterProfile.desiredExperienceLevel) {
            throw new common_1.ForbiddenException("Please complete your profile (contracts, experience, categories) before posting a job offer.");
        }
        const companyId = recruiterProfile.memberships[0].company.id;
        const categoryIds = recruiterProfile.searchedCategories.map(cat => ({ id: cat.id }));
        const jobOffer = await this.prisma.jobOffer.create({
            data: {
                ...createJobOfferDto,
                locationWKT: createJobOfferDto.locationWKT,
                contractType: recruiterProfile.desiredContractTypes[0],
                experienceLevel: recruiterProfile.desiredExperienceLevel,
                company: {
                    connect: { id: companyId },
                },
                createdBy: {
                    connect: { id: recruiterProfile.id },
                },
                categories: {
                    connect: categoryIds,
                },
            },
            include: {
                company: {
                    select: {
                        name: true,
                        logoUrl: true,
                    },
                },
                categories: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return jobOffer;
    }
    async findAll() {
        return this.prisma.jobOffer.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            include: {
                company: {
                    select: {
                        name: true,
                        logoUrl: true,
                    },
                },
                categories: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        memberships: {
                            include: {
                                company: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async findOne(id) {
        const jobOffer = await this.prisma.jobOffer.findUnique({
            where: { id },
            include: {
                company: true,
                categories: true,
                createdBy: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException('Job offer not found.');
        }
        return jobOffer;
    }
    async update(id, userId, updateJobOfferDto) {
        const jobOffer = await this.prisma.jobOffer.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { userId: true },
                },
            },
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException('Job offer not found.');
        }
        if (jobOffer.createdBy.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own job offers.');
        }
        return this.prisma.jobOffer.update({
            where: { id },
            data: updateJobOfferDto,
            include: {
                company: {
                    select: {
                        name: true,
                        logoUrl: true,
                    },
                },
                categories: true,
            },
        });
    }
    async remove(id, userId) {
        const jobOffer = await this.prisma.jobOffer.findUnique({
            where: { id },
            select: {
                createdBy: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException(`Job offer with ID "${id}" not found.`);
        }
        if (jobOffer.createdBy.userId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to delete this job offer.');
        }
        await this.prisma.jobOffer.delete({ where: { id } });
    }
    async findAllByRecruiter(userId) {
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found.');
        }
        return this.prisma.jobOffer.findMany({
            where: {
                createdById: recruiterProfile.id,
            },
            include: {
                company: true,
                categories: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateOffersForRecruiter(recruiterProfileId, data) {
        await this.prisma.jobOffer.updateMany({
            where: {
                createdById: recruiterProfileId,
            },
            data: {
                experienceLevel: data.experienceLevel,
                contractType: data.contractType,
            },
        });
    }
};
exports.JobOfferService = JobOfferService;
exports.JobOfferService = JobOfferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobOfferService);
//# sourceMappingURL=job-offer.service.js.map