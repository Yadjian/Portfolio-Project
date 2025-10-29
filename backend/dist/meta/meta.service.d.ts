import { PrismaService } from '../prisma/prisma.service';
export declare class MetaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRoles(): {
        value: string;
        label: string;
    }[];
    getContractTypes(): {
        value: "CDI" | "CDD" | "ALTERNANCE" | "STAGE" | "FREELANCE" | "AUTRE";
        label: string;
    }[];
    getExperienceLevels(): {
        value: "DEBUTANT" | "INTERMEDIAIRE" | "CONFIRME";
        label: string;
    }[];
    getJobCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }[]>;
    private getContractTypeLabel;
    private getExperienceLevelLabel;
}
