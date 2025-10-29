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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipesService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
let SwipesService = class SwipesService {
    constructor(prisma, swipeQueue, matchQueue) {
        this.prisma = prisma;
        this.swipeQueue = swipeQueue;
        this.matchQueue = matchQueue;
    }
    async handleSwipe(userId, dto) {
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis pour swiper.');
        }
        if (!dto?.profileId?.trim() || !dto?.direction) {
            throw new common_1.BadRequestException('ID de profil et direction requis.');
        }
        const { profileId: swipedProfileId, direction } = dto;
        if (swipedProfileId === userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez pas swiper sur votre propre profil.');
        }
        const swiperUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        if (!swiperUser) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        let candidateId;
        let recruiterId;
        let swiperDirectionField;
        let otherDirectionField;
        if (swiperUser.candidateProfile) {
            candidateId = swiperUser.candidateProfile.id;
            recruiterId = swipedProfileId;
            swiperDirectionField = 'candidateDirection';
            otherDirectionField = 'recruiterDirection';
            const targetRecruiter = await this.prisma.recruiterProfile.findUnique({
                where: { id: swipedProfileId },
                select: { id: true }
            });
            if (!targetRecruiter) {
                console.warn(`🚨 SWIPE SECURITY: Candidate ${userId} tried to swipe on invalid recruiter ${swipedProfileId}`);
                throw new common_1.NotFoundException('Profil recruteur introuvable.');
            }
        }
        else if (swiperUser.recruiterProfile) {
            candidateId = swipedProfileId;
            recruiterId = swiperUser.recruiterProfile.id;
            swiperDirectionField = 'recruiterDirection';
            otherDirectionField = 'candidateDirection';
            const targetCandidate = await this.prisma.candidateProfile.findUnique({
                where: { id: swipedProfileId },
                select: { id: true }
            });
            if (!targetCandidate) {
                console.warn(`🚨 SWIPE SECURITY: Recruiter ${userId} tried to swipe on invalid candidate ${swipedProfileId}`);
                throw new common_1.NotFoundException('Profil candidat introuvable.');
            }
        }
        else {
            throw new common_1.ForbiddenException("L'utilisateur n'a pas de profil actif.");
        }
        const swipe = await this.prisma.swipe.upsert({
            where: {
                candidateId_recruiterId: {
                    candidateId,
                    recruiterId,
                },
            },
            update: {
                [swiperDirectionField]: direction,
            },
            create: {
                candidateId,
                recruiterId,
                [swiperDirectionField]: direction,
            },
        });
        const updatedSwipe = await this.prisma.swipe.findUnique({
            where: { id: swipe.id },
        });
        if (swiperDirectionField === 'candidateDirection' &&
            direction === 'RIGHT' &&
            updatedSwipe.recruiterDirection !== 'RIGHT') {
            await this.swipeQueue.add('candidate-swipe-right', {
                candidateId: candidateId,
                recruiterId: recruiterId,
                swipeId: updatedSwipe.id,
            });
            console.log(`Job ajouté à ${notifications_module_1.SWIPE_NOTIFICATION_QUEUE}: candidate-swipe-right`);
        }
        if (updatedSwipe.candidateDirection === 'RIGHT' &&
            updatedSwipe.recruiterDirection === 'RIGHT' &&
            !updatedSwipe.isMatch) {
            const matchData = await this.prisma.swipe.update({
                where: { id: updatedSwipe.id },
                data: { isMatch: true, matchedAt: new Date() },
            });
            await this.matchQueue.add('new-match-candidate', {
                candidateId: candidateId,
                recruiterId: recruiterId,
                matchId: matchData.id,
                matchedAt: matchData.matchedAt,
            });
            console.log(`Job ajouté à ${notifications_module_1.MATCH_NOTIFICATION_QUEUE}: new-match-candidate`);
            await this.matchQueue.add('new-match-recruiter', {
                candidateId: candidateId,
                recruiterId: recruiterId,
                matchId: matchData.id,
                matchedAt: matchData.matchedAt,
            });
            console.log(`Job ajouté à ${notifications_module_1.MATCH_NOTIFICATION_QUEUE}: new-match-recruiter`);
            return { match: true, matchedAt: matchData.matchedAt };
        }
        console.log(`✅ Swipe authorized: ${direction} by user ${userId} on profile ${swipedProfileId}`);
        return { match: false };
    }
    async undoLastSwipe(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('Utilisateur requis pour annuler un swipe.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        let lastSwipe;
        let directionField;
        if (user.candidateProfile) {
            lastSwipe = await this.prisma.swipe.findFirst({
                where: {
                    candidateId: user.candidateProfile.id,
                    candidateDirection: { not: null },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });
            directionField = 'candidateDirection';
        }
        else if (user.recruiterProfile) {
            lastSwipe = await this.prisma.swipe.findFirst({
                where: {
                    recruiterId: user.recruiterProfile.id,
                    recruiterDirection: { not: null },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });
            directionField = 'recruiterDirection';
        }
        else {
            throw new common_1.ForbiddenException("L'utilisateur n'a pas de profil actif.");
        }
        if (!lastSwipe) {
            return { success: false, message: 'Aucun swipe à annuler.' };
        }
        await this.prisma.swipe.update({
            where: { id: lastSwipe.id },
            data: {
                [directionField]: null,
                isMatch: false,
                matchedAt: null,
            },
        });
        console.log(`✅ Swipe undo authorized: ${lastSwipe.id} by user ${userId}`);
        return { success: true };
    }
};
exports.SwipesService = SwipesService;
exports.SwipesService = SwipesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(notifications_module_1.SWIPE_NOTIFICATION_QUEUE)),
    __param(2, (0, bullmq_1.InjectQueue)(notifications_module_1.MATCH_NOTIFICATION_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], SwipesService);
//# sourceMappingURL=swipes.service.js.map