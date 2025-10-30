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
        const { profileId: swipedProfileId, direction } = dto;
        const swiperUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        if (!swiperUser) {
            throw new common_1.NotFoundException('User not found.');
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
        }
        else if (swiperUser.recruiterProfile) {
            candidateId = swipedProfileId;
            recruiterId = swiperUser.recruiterProfile.id;
            swiperDirectionField = 'recruiterDirection';
            otherDirectionField = 'candidateDirection';
        }
        else {
            throw new common_1.ForbiddenException("User does not have an active profile.");
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
            await this.matchQueue.add('new-match-recruiter', {
                candidateId: candidateId,
                recruiterId: recruiterId,
                matchId: matchData.id,
                matchedAt: matchData.matchedAt,
            });
            return { match: true, matchedAt: matchData.matchedAt };
        }
        return { match: false };
    }
    async undoLastSwipe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: { select: { id: true } },
                recruiterProfile: { select: { id: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
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
            throw new common_1.ForbiddenException("User does not have an active profile.");
        }
        if (!lastSwipe) {
            return { success: false, message: 'No swipe to undo.' };
        }
        await this.prisma.swipe.update({
            where: { id: lastSwipe.id },
            data: {
                [directionField]: null,
                isMatch: false,
                matchedAt: null,
            },
        });
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