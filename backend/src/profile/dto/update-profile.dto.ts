// This DTO is used to validate and transfer profile update data for both candidates and recruiters.

import { IsString, IsOptional, IsNotEmpty, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ContractType, ExperienceLevel } from '@prisma/client';

export class UpdateProfileDto {
  // --- Common Fields ---
  @IsString() // Must be a string
  @IsNotEmpty() // First name cannot be empty
  firstName: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Last name cannot be empty
  lastName: string;

  @IsOptional() // Field is optional
  @IsString() // Must be a string if provided
  locationWKT?: string; // Well-Known Text representation of location

  @IsOptional() // Field is optional
  @IsString() // Must be a string if provided
  locationName?: string; // Human-readable location name

  @IsOptional() // Field is optional
  @IsArray() // Must be an array if provided
  @IsUUID('4', { each: true }) // Each element must be a valid UUID v4
  interestedInCategoryIds?: string[]; // Categories the user is interested in

  // --- Candidate-Specific Fields ---
  @IsOptional()
  @IsString() // Must be a string if provided
  coverLetterText?: string; // Candidate's cover letter

  @IsOptional()
  @IsString() // Must be a string if provided
  desiredJobTitle?: string; // Candidate's desired job title

  // --- Preference Fields (Candidate AND Recruiter) ---
  @IsOptional()
  @IsEnum(ExperienceLevel) // Must be a valid ExperienceLevel enum value
  experienceLevel?: ExperienceLevel; // For candidate

  @IsOptional()
  @IsEnum(ExperienceLevel) // Must be a valid ExperienceLevel enum value
  desiredExperienceLevel?: ExperienceLevel; // For recruiter (alias)

  @IsOptional()
  @IsArray() // Must be an array if provided
  @IsEnum(ContractType, { each: true }) // Each element must be a valid ContractType enum value
  desiredContractTypes?: ContractType[]; // Preferred contract types

  // --- Recruiter-Specific Fields ---
  @IsOptional()
  @IsString() // Must be a string if provided
  searchDescription?: string; // Description of what the recruiter is searching for
}
