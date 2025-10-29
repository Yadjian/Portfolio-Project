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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCompanyForRecruiter(dto, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis pour créer une entreprise.');
        }
        if (!dto.companyName?.trim() || !dto.siret?.trim()) {
            throw new common_1.BadRequestException('Nom d\'entreprise et SIRET requis.');
        }
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            include: { memberships: true },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Profil recruteur introuvable pour cet utilisateur.');
        }
        if (recruiterProfile.memberships.length > 0) {
            throw new common_1.ConflictException('Ce recruteur est déjà associé à une entreprise.');
        }
        const existingCompany = await this.prisma.company.findUnique({
            where: { siret: dto.siret },
        });
        if (existingCompany) {
            throw new common_1.ConflictException('Une entreprise avec ce numéro SIRET existe déjà.');
        }
        return this.prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: dto.companyName,
                    siret: dto.siret,
                },
            });
            const membership = await tx.recruiterMembership.create({
                data: {
                    recruiterId: recruiterProfile.id,
                    companyId: company.id,
                    isPrimary: true,
                    internalRole: 'Admin',
                },
            });
            console.log(`✅ Company created: ${company.id} (${company.name}) by user ${userId}`);
            console.log(`✅ Membership created: ${membership.id} for recruiter ${recruiterProfile.id}`);
            return { company, membership };
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map