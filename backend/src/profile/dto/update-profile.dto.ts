// Fichier: backend/src/profile/dto/update-profile.dto.ts

import { IsString, IsOptional, IsNotEmpty, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ContractType, ExperienceLevel } from '@prisma/client';

export class UpdateProfileDto {
  // --- Champs Communs ---
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
  @IsArray()
  @IsUUID('4', { each: true }) // Valide que chaque élément est un UUID v4
  interestedInCategoryIds?: string[];

  // --- Champs Spécifiques au Candidat ---
  @IsOptional() @IsString()
  coverLetterText?: string;

  @IsOptional()
  @IsString()
  desiredJobTitle?: string;

  // --- Champs pour les Préférences (Candidat ET Recruteur) ---
  @IsOptional() 
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel; // Pour le candidat

  @IsOptional()
  @IsEnum(ExperienceLevel)
  desiredExperienceLevel?: ExperienceLevel; // Pour le recruteur (alias)

  @IsOptional() 
  @IsArray() 
  @IsEnum(ContractType, { each: true })
  desiredContractTypes?: ContractType[];

  // --- Champs Spécifiques au Recruteur ---
  @IsOptional() @IsString()
  searchDescription?: string;

}
