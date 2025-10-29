import { Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
export declare class SwipesService {
    private prisma;
    private swipeQueue;
    private matchQueue;
    constructor(prisma: PrismaService, swipeQueue: Queue, matchQueue: Queue);
    handleSwipe(userId: string, dto: CreateSwipeDto): Promise<{
        match: boolean;
        matchedAt: Date;
    } | {
        match: boolean;
        matchedAt?: undefined;
    }>;
    undoLastSwipe(userId: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
