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
        console.log('🔍 [Discovery] Getting recruiters for candidate userId:', userId);
        const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        console.log('👤 [Discovery] Candidate profile:', candidateProfile ? {
            id: candidateProfile.id,
            name: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
            locationWKT: candidateProfile.locationWKT,
        } : 'NOT FOUND');
        if (!candidateProfile) {
            throw new common_1.NotFoundException('Profil candidat non trouvé.');
        }
        if (!candidateProfile.locationWKT) {
            throw new common_1.NotFoundException('Votre localisation est requise pour la découverte.');
        }
        const candidateId = candidateProfile.id;
        const swipedRecruiters = await this.prisma.swipe.findMany({
            where: { candidateId: candidateId },
            select: { recruiterId: true },
        });
        const swipedRecruiterIds = swipedRecruiters.map(s => s.recruiterId);
        console.log('🚫 [Discovery] Already swiped recruiters:', swipedRecruiterIds.length);
        console.log('🔎 [Discovery] Searching for recruiters within', radiusInMeters, 'meters from', candidateProfile.locationWKT);
        const nearbyRecruiterResults = await this.prisma.$queryRaw `
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        ST_GeomFromText("locationWKT", 4326)::geography,
        ST_GeomFromText(${candidateProfile.locationWKT}, 4326)::geography,
        ${radiusInMeters}
      )
    `;
        const nearbyRecruiterIds = nearbyRecruiterResults.map(r => r.id);
        console.log('📍 [Discovery] Nearby recruiters found:', nearbyRecruiterIds.length, nearbyRecruiterIds);
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
        console.log('✅ [Discovery] Final recruiters to return:', finalRecruiters.length);
        const recruitersWithCompany = finalRecruiters.map(recruiter => ({
            ...recruiter,
            companyName: recruiter.memberships?.[0]?.company?.name || null,
        }));
        console.log('🏢 [Discovery] Sample recruiter with company:', recruitersWithCompany[0] ? {
            firstName: recruitersWithCompany[0].firstName,
            lastName: recruitersWithCompany[0].lastName,
            companyName: recruitersWithCompany[0].companyName,
            hasMemberships: !!recruitersWithCompany[0].memberships?.length,
        } : 'No recruiters');
        return recruitersWithCompany;
    }
    async getCandidatesForRecruiter(userId, radiusInMeters = 20000) {
        console.log('🔍 [Discovery] Getting candidates for recruiter userId:', userId);
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
        });
        console.log('👤 [Discovery] Recruiter profile:', recruiterProfile ? {
            id: recruiterProfile.id,
            name: `${recruiterProfile.firstName} ${recruiterProfile.lastName}`,
            locationWKT: recruiterProfile.locationWKT,
        } : 'NOT FOUND');
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Profil recruteur non trouvé.');
        }
        if (!recruiterProfile.locationWKT) {
            throw new common_1.NotFoundException('Votre localisation est requise pour la découverte.');
        }
        const recruiterId = recruiterProfile.id;
        const swipedCandidates = await this.prisma.swipe.findMany({
            where: { recruiterId: recruiterId },
            select: { candidateId: true },
        });
        const swipedCandidateIds = swipedCandidates.map(s => s.candidateId);
        console.log('🚫 [Discovery] Already swiped candidates:', swipedCandidateIds.length);
        console.log('🔎 [Discovery] Searching for candidates within', radiusInMeters, 'meters from', recruiterProfile.locationWKT);
        const nearbyCandidateResults = await this.prisma.$queryRaw `
      SELECT "id"
      FROM "CandidateProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        ST_GeomFromText("locationWKT", 4326)::geography,
        ST_GeomFromText(${recruiterProfile.locationWKT}, 4326)::geography,
        ${radiusInMeters}
      )
    `;
        const nearbyCandidateIds = nearbyCandidateResults.map(r => r.id);
        console.log('📍 [Discovery] Nearby candidates found:', nearbyCandidateIds.length, nearbyCandidateIds);
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
        console.log('✅ [Discovery] Final candidates to return:', finalCandidates.length);
        return finalCandidates;
    }
    async getPendingCandidatesForRecruiter(userId) {
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            throw new common_1.NotFoundException('Profil recruteur non trouvé.');
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