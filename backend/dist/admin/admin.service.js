"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                candidateProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        locationName: true,
                        desiredJobTitle: true,
                        experienceLevel: true,
                        desiredContractTypes: true,
                        coverLetterText: true,
                        interestedInCategories: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                recruiterProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        locationName: true,
                        searchDescription: true,
                        desiredContractTypes: true,
                        desiredExperienceLevel: true,
                        searchedCategories: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        memberships: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        siret: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return users.map(user => ({
            ...user,
            role: user.candidateProfile
                ? 'candidate'
                : user.recruiterProfile
                    ? 'recruiter'
                    : 'admin',
        }));
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                candidateProfile: true,
                recruiterProfile: {
                    include: {
                        memberships: {
                            include: {
                                company: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return {
            ...user,
            role: user.candidateProfile
                ? 'candidate'
                : user.recruiterProfile
                    ? 'recruiter'
                    : 'admin',
        };
    }
    async createUser(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
            },
        });
        if (dto.role === 'candidate' && dto.candidateData) {
            await this.prisma.candidateProfile.create({
                data: {
                    userId: user.id,
                    ...dto.candidateData,
                },
            });
        }
        else if (dto.role === 'recruiter' && dto.recruiterData) {
            await this.prisma.recruiterProfile.create({
                data: {
                    userId: user.id,
                    ...dto.recruiterData,
                },
            });
        }
        return this.getUserById(user.id);
    }
    async updateUser(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const updateData = {};
        if (dto.email)
            updateData.email = dto.email;
        if (dto.password)
            updateData.password = await bcrypt.hash(dto.password, 10);
        if (Object.keys(updateData).length > 0) {
            await this.prisma.user.update({
                where: { id },
                data: updateData,
            });
        }
        if (dto.candidateData) {
            const existing = await this.prisma.candidateProfile.findUnique({ where: { userId: id } });
            if (existing) {
                await this.prisma.candidateProfile.update({
                    where: { userId: id },
                    data: dto.candidateData,
                });
            }
        }
        if (dto.recruiterData) {
            const existing = await this.prisma.recruiterProfile.findUnique({ where: { userId: id } });
            if (existing) {
                await this.prisma.recruiterProfile.update({
                    where: { userId: id },
                    data: dto.recruiterData,
                });
            }
        }
        return this.getUserById(id);
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        await this.prisma.user.delete({ where: { id } });
        return { message: 'Utilisateur supprimé' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map