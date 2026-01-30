// This file defines the CreateJobOfferDto class used for validating job offer creation data.

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Matches,
} from 'class-validator';
import { ContractType, ExperienceLevel } from '@prisma/client';

// DTO for creating a new job offer.
// Ensures all required fields are present and valid, and optional fields are validated if provided.
export class CreateJobOfferDto {
  @IsString() // Must be a string
  @IsNotEmpty() // Title cannot be empty
  title: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Description cannot be empty
  description: string;

  @IsOptional() // Work hours are optional
  @IsString() // Must be a string if provided
  workHours?: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Location WKT cannot be empty
  @Matches(/^POINT\s*\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/, {
    message:
      'locationWKT must be a valid WKT POINT string (e.g., "POINT(longitude latitude)")',
  }) // Must match the WKT POINT format
  locationWKT: string;

  @IsOptional() // Location name is optional
  @IsString() // Must be a string if provided
  locationName?: string;

  @IsOptional() // Minimum salary is optional
  @IsInt() // Must be an integer if provided
  salaryMin?: number;

  @IsOptional() // Maximum salary is optional
  @IsInt() // Must be an integer if provided
  salaryMax?: number;
}
