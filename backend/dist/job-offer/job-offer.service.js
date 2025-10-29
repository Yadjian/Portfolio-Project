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
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis pour créer une offre.');
        }
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            include: {
                memberships: { include: { company: true } },
                searchedCategories: true,
            },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Profil recruteur introuvable.');
        }
        if (!recruiterProfile.memberships?.length) {
            throw new common_1.ForbiddenException('Vous devez être associé à une entreprise.');
        }
        if (!recruiterProfile.searchedCategories?.length || !recruiterProfile.desiredContractTypes?.length || !recruiterProfile.desiredExperienceLevel) {
            throw new common_1.ForbiddenException("Veuillez finaliser votre profil (contrats, expérience, catégories) avant de poster une offre.");
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
        console.log(`✅ Job offer created: ${jobOffer.id} by user ${userId}`);
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
        if (!id || !userId) {
            throw new common_1.BadRequestException('ID offre et utilisateur requis.');
        }
        const jobOffer = await this.prisma.jobOffer.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { userId: true },
                },
            },
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException('Offre d\'emploi introuvable.');
        }
        const isCreator = jobOffer.createdBy.userId === userId;
        let isMemberOfCompany = false;
        if (!isCreator) {
            const membership = await this.prisma.recruiterMembership.findFirst({
                where: {
                    companyId: jobOffer.companyId,
                    recruiter: { userId: userId }
                }
            });
            isMemberOfCompany = !!membership;
        }
        if (!isCreator && !isMemberOfCompany) {
            console.warn(`🚨 IDOR blocked: User ${userId} tried to update job offer ${id}`);
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que les offres de votre entreprise.');
        }
        console.log(`✅ Job offer update authorized: ${id} by user ${userId} (creator: ${isCreator}, member: ${isMemberOfCompany})`);
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
        if (!id || !userId) {
            throw new common_1.BadRequestException('ID offre et utilisateur requis.');
        }
        const jobOffer = await this.prisma.jobOffer.findUnique({
            where: { id },
            select: {
                companyId: true,
                createdBy: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!jobOffer) {
            throw new common_1.NotFoundException(`Offre d'emploi avec l'ID "${id}" introuvable.`);
        }
        const isCreator = jobOffer.createdBy.userId === userId;
        let isMemberOfCompany = false;
        if (!isCreator) {
            const membership = await this.prisma.recruiterMembership.findFirst({
                where: {
                    companyId: jobOffer.companyId,
                    recruiter: { userId: userId }
                }
            });
            isMemberOfCompany = !!membership;
        }
        if (!isCreator && !isMemberOfCompany) {
            console.warn(`🚨 IDOR deletion blocked: User ${userId} tried to delete job offer ${id}`);
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette offre.');
        }
        console.log(`✅ Job offer deletion authorized: ${id} by user ${userId} (creator: ${isCreator}, member: ${isMemberOfCompany})`);
        await this.prisma.jobOffer.delete({ where: { id } });
    }
    async findAllByRecruiter(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis.');
        }
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