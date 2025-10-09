// Fichier: backend/src/job-offer/dto/create-job-offer.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional, IsInt, Matches } from 'class-validator';
import { ContractType } from '@prisma/client'; // Importez l'enum généré par Prisma

export class CreateJobOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(ContractType)
  contractType: ContractType;

  @IsOptional()
  @IsString()
  workHours?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^POINT\s*\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/, {
  message: 'locationWKT must be a valid WKT POINT string (e.g., "POINT(longitude latitude)")',
  })
  locationWKT: string;

  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  salaryMax?: number;
}
