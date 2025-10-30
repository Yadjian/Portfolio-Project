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
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscoveryService = class DiscoveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRecruitersForCandidate(userId, radiusInMeters = 20000) {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidateProfile) {
            throw new common_1.NotFoundException('Candidate profile not found.');
        }
        if (!candidateProfile.locationWKT) {
            throw new common_1.NotFoundException('Your location is required for discovery.');
        }
        const candidateId = candidateProfile.id;
        const swipedRecruiters = await this.prisma.swipe.findMany({
            where: { candidateId: candidateId },
            select: { recruiterId: true },
        });
        const swipedRecruiterIds = swipedRecruiters.map(s => s.recruiterId);
        const nearbyRecruiterResults = await this.prisma.$queryRaw `
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${candidateProfile.locationWKT}::geography,
        ${radiusInMeters}
      )
    `;
        const nearbyRecruiterIds = nearbyRecruiterResults.map(r => r.id);
        const finalRecruiters = await this.prisma.recruiterProfile.findMany({
            where: {
                id: {
                    in: nearbyRecruiterIds,
                    notIn: swipedRecruiterIds,
                },
            },
            include: {
                searchedCategories: true,
                memberships: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        const recruitersWithCompany = finalRecruiters.map(recruiter => ({
            ...recruiter,
            companyName: recruiter.memberships?.[0]?.company?.name || null,
        }));
        return recruitersWithCompany;
    }
    async getCandidatesForRecruiter(userId, radiusInMeters = 20000) {
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found.');
        }
        if (!recruiterProfile.locationWKT) {
            throw new common_1.NotFoundException('Your location is required for discovery.');
        }
        const recruiterId = recruiterProfile.id;
        const swipedCandidates = await this.prisma.swipe.findMany({
            where: { recruiterId: recruiterId },
            select: { candidateId: true },
        });
        const swipedCandidateIds = swipedCandidates.map(s => s.candidateId);
        const nearbyCandidateResults = await this.prisma.$queryRaw `
      SELECT "id"
      FROM "CandidateProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${recruiterProfile.locationWKT}::geography,
        ${radiusInMeters}
      )
    `;
        const nearbyCandidateIds = nearbyCandidateResults.map(r => r.id);
        const finalCandidates = await this.prisma.candidateProfile.findMany({
            where: {
                id: {
                    in: nearbyCandidateIds,
                    notIn: swipedCandidateIds,
                },
            },
            include: {
                interestedInCategories: true,
            },
        });
        return finalCandidates;
    }
    async getPendingCandidatesForRecruiter(userId) {
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found.');
        }
        const pendingSwipes = await this.prisma.swipe.findMany({
            where: {
                recruiterId: recruiterProfile.id,
                candidateDirection: 'RIGHT',
                recruiterDirection: null,
            },
            include: {
                candidate: {
                    include: {
                        interestedInCategories: true,
                    },
                },
            },
        });
        return pendingSwipes.map(swipe => swipe.candidate);
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map