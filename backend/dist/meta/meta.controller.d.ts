import { MetaService } from './meta.service';
export declare class MetaController {
    private readonly metaService;
    constructor(metaService: MetaService);
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
}
