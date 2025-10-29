import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCompanyForRecruiter(dto: CreateCompanyOnboardingDto, userId: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            siret: string;
            logoUrl: string | null;
        };
        membership: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            internalRole: string;
            isPrimary: boolean;
            recruiterId: string;
            companyId: string;
        };
    }>;
}
