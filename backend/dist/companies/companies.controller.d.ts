import { Request } from 'express';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    createCompanyOnboarding(req: Request, dto: CreateCompanyOnboardingDto): Promise<{
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
