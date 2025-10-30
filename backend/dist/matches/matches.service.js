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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchesService = class MatchesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllMatches(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        let whereClause;
        if (user.candidateProfile) {
            whereClause = {
                candidateId: user.candidateProfile.id,
                isMatch: true,
            };
        }
        else if (user.recruiterProfile) {
            whereClause = {
                recruiterId: user.recruiterProfile.id,
                isMatch: true,
            };
        }
        else {
            throw new common_1.NotFoundException('Profile not found.');
        }
        const matches = await this.prisma.swipe.findMany({
            where: whereClause,
            include: {
                candidate: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        photoUrl: true,
                        desiredJobTitle: true,
                        desiredContractTypes: true,
                    },
                },
                recruiter: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        searchedCategories: {
                            select: { name: true },
                            take: 1,
                        },
                        desiredContractTypes: true,
                        memberships: {
                            include: {
                                company: {
                                    select: { name: true },
                                },
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
        return matches.map(match => {
            if (user.candidateProfile) {
                const recruiter = match.recruiter;
                return {
                    matchId: match.id,
                    matchedAt: match.matchedAt,
                    profile: {
                        ...recruiter,
                        companyName: recruiter.memberships?.[0]?.company?.name || null,
                        searchedJobTitle: recruiter.searchedCategories?.[0]?.name || null,
                        contractType: recruiter.desiredContractTypes?.[0] || null,
                    },
                };
            }
            else {
                const candidate = match.candidate;
                return {
                    matchId: match.id,
                    matchedAt: match.matchedAt,
                    profile: {
                        ...candidate,
                        contractType: candidate.desiredContractTypes?.[0] || null,
                    },
                };
            }
        });
    }
    async getMatchDetails(userId, swipeId) {
        const swipe = await this.prisma.swipe.findUnique({
            where: { id: swipeId },
            include: {
                candidate: { select: { userId: true, id: true } },
                recruiter: { select: { userId: true, id: true } },
            },
        });
        if (!swipe) {
            throw new common_1.NotFoundException('Match not found.');
        }
        if (!swipe.isMatch) {
            throw new common_1.ForbiddenException("This is not yet a match.");
        }
        const isUserCandidate = swipe.candidate.userId === userId;
        const isUserRecruiter = swipe.recruiter.userId === userId;
        if (!isUserCandidate && !isUserRecruiter) {
            throw new common_1.ForbiddenException('Unauthorized access to this match.');
        }
        if (isUserCandidate) {
            return this.prisma.jobOffer.findMany({
                where: {
                    createdById: swipe.recruiterId,
                    isActive: true,
                },
                include: {
                    company: true,
                    categories: true,
                },
            });
        }
        if (isUserRecruiter) {
            return this.prisma.candidateProfile.findUnique({
                where: {
                    id: swipe.candidateId,
                },
                include: {
                    interestedInCategories: true,
                },
            });
        }
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map