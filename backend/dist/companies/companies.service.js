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
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            include: { memberships: true },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found for this user.');
        }
        if (recruiterProfile.memberships.length > 0) {
            throw new common_1.ConflictException('This recruiter is already associated with a company.');
        }
        const existingCompany = await this.prisma.company.findUnique({
            where: { siret: dto.siret },
        });
        if (existingCompany) {
            throw new common_1.ConflictException('A company with this SIRET number already exists.');
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