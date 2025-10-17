// Fichier: backend/src/job-offer/dto/update-job-offer.dto.ts
import { IsString, IsEnum, IsOptional, IsInt, IsNotEmpty, Matches, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { ContractType, ExperienceLevel } from '@prisma/client';

export class UpdateJobOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsString()
  @IsOptional()
  @Matches(/^POINT\s*\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/, {
  message: 'locationWKT must be a valid WKT POINT string (e.g., "POINT(longitude latitude)")',
  })
  locationWKT?: string;

  @IsInt()
  @IsOptional()
  salaryMin?: number;

  @IsInt()
  @IsOptional()
  salaryMax?: number;

  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel?: ExperienceLevel;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
