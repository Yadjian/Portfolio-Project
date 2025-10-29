import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    checkHealth(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
