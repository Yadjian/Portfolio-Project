import { ContractType, ExperienceLevel } from '@prisma/client';
export declare class UpdateProfileDto {
    firstName: string;
    lastName: string;
    locationWKT?: string;
    locationName?: string;
    interestedInCategoryIds?: string[];
    coverLetterText?: string;
    desiredJobTitle?: string;
    experienceLevel?: ExperienceLevel;
    desiredExperienceLevel?: ExperienceLevel;
    desiredContractTypes?: ContractType[];
    searchDescription?: string;
}
