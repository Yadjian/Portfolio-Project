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
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis pour voir les matches.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable.');
        }
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
            throw new common_1.NotFoundException('Profil non trouvé.');
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
        console.log(`✅ Matches list accessed by user ${userId}: ${matches.length} matches found`);
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
        if (!userId || !swipeId) {
            throw new common_1.BadRequestException('Utilisateur et ID de match requis.');
        }
        const swipe = await this.prisma.swipe.findUnique({
            where: { id: swipeId },
            include: {
                candidate: { select: { userId: true, id: true } },
                recruiter: { select: { userId: true, id: true } },
            },
        });
        if (!swipe) {
            throw new common_1.NotFoundException('Match non trouvé.');
        }
        if (!swipe.isMatch) {
            throw new common_1.ForbiddenException("Ce n'est pas encore un match.");
        }
        const isUserCandidate = swipe.candidate.userId === userId;
        const isUserRecruiter = swipe.recruiter.userId === userId;
        if (!isUserCandidate && !isUserRecruiter) {
            console.warn(`🚨 MATCH IDOR BLOCKED: User ${userId} tried to access match ${swipeId} without authorization`);
            throw new common_1.ForbiddenException('Accès non autorisé à ce match.');
        }
        console.log(`✅ Match details accessed: ${swipeId} by user ${userId} (candidate: ${isUserCandidate}, recruiter: ${isUserRecruiter})`);
        if (isUserCandidate) {
            const jobOffers = await this.prisma.jobOffer.findMany({
                where: {
                    createdById: swipe.recruiterId,
                    isActive: true,
                },
                include: {
                    company: true,
                    categories: true,
                },
            });
            console.log(`✅ Candidate ${userId} accessed ${jobOffers.length} job offers from match ${swipeId}`);
            return jobOffers;
        }
        if (isUserRecruiter) {
            const candidateProfile = await this.prisma.candidateProfile.findUnique({
                where: {
                    id: swipe.candidateId,
                },
                include: {
                    interestedInCategories: true,
                },
            });
            console.log(`✅ Recruiter ${userId} accessed candidate profile from match ${swipeId}`);
            return candidateProfile;
        }
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map