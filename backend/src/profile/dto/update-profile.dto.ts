// Fichier: backend/src/profile/dto/update-profile.dto.ts

import { IsString, IsOptional, IsNotEmpty, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ContractType, ExperienceLevel } from '@prisma/client';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  locationWKT?: string;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsArray()
  @IsEnum(ContractType, { each: true }) // Valide que chaque élément du tableau est un ContractType valide
  desiredContractTypes?: ContractType[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true }) // Valide que chaque élément est un UUID v4
  interestedInCategoryIds?: string[];

  // Ajoutez d'autres champs que l'utilisateur peut modifier.
  // @IsOptional() signifie que le champ n'est pas obligatoire.
  @IsOptional()
  @IsString()
  desiredJobTitle?: string;
}
