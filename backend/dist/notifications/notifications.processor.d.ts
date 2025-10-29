import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class SwipeNotificationsProcessor extends WorkerHost {
    private readonly firebaseService;
    private readonly prisma;
    constructor(firebaseService: FirebaseService, prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
    handleCandidateSwipe(job: Job<any>): Promise<void>;
}
export declare class MatchNotificationsProcessor extends WorkerHost {
    private readonly firebaseService;
    private readonly prisma;
    constructor(firebaseService: FirebaseService, prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
    handleMatchCandidate(job: Job<any>): Promise<void>;
    handleMatchRecruiter(job: Job<any>): Promise<void>;
}
