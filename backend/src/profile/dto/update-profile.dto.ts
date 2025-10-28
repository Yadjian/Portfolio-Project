// Fichier: backend/src/profile/dto/update-profile.dto.ts

import { 
  IsString, 
  IsOptional, 
  IsNotEmpty, 
  IsArray, 
  IsEnum, 
  IsUUID,
  MaxLength,
  ArrayMaxSize,
  MinLength,
  ValidateIf
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ContractType, ExperienceLevel } from '@prisma/client';

export class UpdateProfileDto {
  // --- Champs Communs - OPTIONNELS pour compatibilité ---
  @IsOptional() // ✅ OPTIONNEL pour ne pas casser le frontend
  @ValidateIf((o) => o.firstName !== undefined && o.firstName !== null)
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom ne peut pas être vide' })
  @MinLength(1, { message: 'Le prénom doit contenir au moins 1 caractère' })
  @MaxLength(100, { message: 'Le prénom est trop long (max 100 caractères)' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional() // ✅ OPTIONNEL pour ne pas casser le frontend
  @ValidateIf((o) => o.lastName !== undefined && o.lastName !== null)
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  @MinLength(1, { message: 'Le nom doit contenir au moins 1 caractère' })
  @MaxLength(100, { message: 'Le nom est trop long (max 100 caractères)' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @ValidateIf((o) => o.locationWKT !== undefined && o.locationWKT !== null)
  @IsString({ message: 'La localisation doit être une chaîne de caractères' })
  @MaxLength(500, { message: 'La localisation WKT est trop longue (max 500 caractères)' })
  locationWKT?: string;

  @IsOptional()
  @ValidateIf((o) => o.locationName !== undefined && o.locationName !== null)
  @IsString({ message: 'Le nom de lieu doit être une chaîne de caractères' })
  @MaxLength(255, { message: 'Le nom de lieu est trop long (max 255 caractères)' })
  @Transform(({ value }) => value?.trim())
  locationName?: string;

  @IsOptional()
  @ValidateIf((o) => o.interestedInCategoryIds !== undefined && o.interestedInCategoryIds !== null)
  @IsArray({ message: 'Les catégories doivent être un tableau' })
  @IsUUID('4', { each: true, message: 'Chaque catégorie doit être un UUID valide' })
  @ArrayMaxSize(30, { message: 'Trop de catégories sélectionnées (max 30)' })
  interestedInCategoryIds?: string[];

  // --- Champs Spécifiques au Candidat ---
  @IsOptional()
  @ValidateIf((o) => o.coverLetterText !== undefined && o.coverLetterText !== null)
  @IsString({ message: 'La lettre de motivation doit être une chaîne de caractères' })
  @MaxLength(10000, { message: 'La lettre de motivation est trop longue (max 10 000 caractères)' })
  @Transform(({ value }) => value?.trim())
  coverLetterText?: string;

  @IsOptional()
  @ValidateIf((o) => o.desiredJobTitle !== undefined && o.desiredJobTitle !== null)
  @IsString({ message: 'Le titre du poste désiré doit être une chaîne de caractères' })
  @MaxLength(150, { message: 'Le titre du poste est trop long (max 150 caractères)' })
  @Transform(({ value }) => value?.trim())
  desiredJobTitle?: string;

  // --- Champs pour les Préférences ---
  @IsOptional()
  @ValidateIf((o) => o.experienceLevel !== undefined && o.experienceLevel !== null)
  @IsEnum(ExperienceLevel, { message: 'Niveau d\'expérience invalide' })
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @ValidateIf((o) => o.desiredExperienceLevel !== undefined && o.desiredExperienceLevel !== null)
  @IsEnum(ExperienceLevel, { message: 'Niveau d\'expérience désiré invalide' })
  desiredExperienceLevel?: ExperienceLevel;

  @IsOptional()
  @ValidateIf((o) => o.desiredContractTypes !== undefined && o.desiredContractTypes !== null)
  @IsArray({ message: 'Les types de contrat doivent être un tableau' })
  @IsEnum(ContractType, { each: true, message: 'Type de contrat invalide' })
  @ArrayMaxSize(10, { message: 'Trop de types de contrat sélectionnés (max 10)' })
  desiredContractTypes?: ContractType[];

  // --- Champs Spécifiques au Recruteur ---
  @IsOptional()
  @ValidateIf((o) => o.searchDescription !== undefined && o.searchDescription !== null)
  @IsString({ message: 'La description de recherche doit être une chaîne de caractères' })
  @MaxLength(5000, { message: 'La description de recherche est trop longue (max 5 000 caractères)' })
  @Transform(({ value }) => value?.trim())
  searchDescription?: string;
}
