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
exports.MatchNotificationsProcessor = exports.SwipeNotificationsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const firebase_service_1 = require("../firebase/firebase.service");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_module_1 = require("./notifications.module");
let SwipeNotificationsProcessor = class SwipeNotificationsProcessor extends bullmq_2.WorkerHost {
    constructor(firebaseService, prisma) {
        super();
        this.firebaseService = firebaseService;
        this.prisma = prisma;
    }
    async process(job) {
        console.log(`[${notifications_module_1.SWIPE_NOTIFICATION_QUEUE}] Received job ${job.id} with name ${job.name}`);
        switch (job.name) {
            case 'candidate-swipe-right':
                return this.handleCandidateSwipe(job);
            default:
                console.warn(`[${notifications_module_1.SWIPE_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`);
                break;
        }
    }
    async handleCandidateSwipe(job) {
        console.log(`[swipe-notification] Processing job ${job.id} (candidate-swipe-right)`);
        const { candidateId, recruiterId } = job.data;
        try {
            const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
                where: { id: recruiterId },
                select: { pushToken: true }
            });
            const candidateProfile = await this.prisma.candidateProfile.findUnique({
                where: { id: candidateId },
                select: { firstName: true }
            });
            if (recruiterProfile?.pushToken && candidateProfile) {
                await this.firebaseService.sendPushNotification(recruiterProfile.pushToken, 'Nouveau Swipe ! 👍', `${candidateProfile.firstName} est intéressé(e) par votre profil !`, { type: 'new_swipe', candidateId: candidateId });
            }
            else {
                console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
            }
        }
        catch (error) {
            console.error(`Error processing job ${job.id} (candidate-swipe-right):`, error);
        }
    }
};
exports.SwipeNotificationsProcessor = SwipeNotificationsProcessor;
exports.SwipeNotificationsProcessor = SwipeNotificationsProcessor = __decorate([
    (0, bullmq_1.Processor)('swipe-notification'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        prisma_service_1.PrismaService])
], SwipeNotificationsProcessor);
let MatchNotificationsProcessor = class MatchNotificationsProcessor extends bullmq_2.WorkerHost {
    constructor(firebaseService, prisma) {
        super();
        this.firebaseService = firebaseService;
        this.prisma = prisma;
    }
    async process(job) {
        console.log(`[${notifications_module_1.MATCH_NOTIFICATION_QUEUE}] Received job ${job.id} with name ${job.name}`);
        switch (job.name) {
            case 'new-match-candidate':
                return this.handleMatchCandidate(job);
            case 'new-match-recruiter':
                return this.handleMatchRecruiter(job);
            default:
                console.warn(`[${notifications_module_1.MATCH_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`);
                break;
        }
    }
    async handleMatchCandidate(job) {
        console.log(`[match-notification] Processing job ${job.id} (new-match-candidate)`);
        const { candidateId, recruiterId } = job.data;
        try {
            const candidateProfile = await this.prisma.candidateProfile.findUnique({
                where: { id: candidateId },
                select: { pushToken: true }
            });
            const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
                where: { id: recruiterId },
                select: { firstName: true }
            });
            if (candidateProfile?.pushToken && recruiterProfile) {
                await this.firebaseService.sendPushNotification(candidateProfile.pushToken, '🎉 Nouveau Match !', `Vous avez matché avec ${recruiterProfile.firstName} ! Consultez vos matchs.`, { type: 'new_match', recruiterId: recruiterId });
            }
            else {
                console.warn(`Candidate ${candidateId} has no push token or recruiter ${recruiterId} not found.`);
            }
        }
        catch (error) {
            console.error(`Error processing job ${job.id} (new-match-candidate):`, error);
        }
    }
    async handleMatchRecruiter(job) {
        console.log(`[match-notification] Processing job ${job.id} (new-match-recruiter)`);
        const { candidateId, recruiterId } = job.data;
        try {
            const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
                where: { id: recruiterId },
                select: { pushToken: true }
            });
            const candidateProfile = await this.prisma.candidateProfile.findUnique({
                where: { id: candidateId },
                select: { firstName: true }
            });
            if (recruiterProfile?.pushToken && candidateProfile) {
                await this.firebaseService.sendPushNotification(recruiterProfile.pushToken, '🎉 Nouveau Match !', `Vous avez matché avec ${candidateProfile.firstName} ! Consultez vos matchs.`, { type: 'new_match', candidateId: candidateId });
            }
            else {
                console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
            }
        }
        catch (error) {
            console.error(`Error processing job ${job.id} (new-match-recruiter):`, error);
        }
    }
};
exports.MatchNotificationsProcessor = MatchNotificationsProcessor;
exports.MatchNotificationsProcessor = MatchNotificationsProcessor = __decorate([
    (0, bullmq_1.Processor)('match-notification'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        prisma_service_1.PrismaService])
], MatchNotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map