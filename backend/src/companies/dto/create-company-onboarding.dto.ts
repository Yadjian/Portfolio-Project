// This file defines the DTO for validating company onboarding data during registration.

import { IsNotEmpty, IsString, Length } from 'class-validator';

// CreateCompanyOnboardingDto is used to validate the request body when onboarding a new company.
// It ensures the company name is provided and the SIRET number is exactly 14 characters.
export class CreateCompanyOnboardingDto {
  @IsString() // Must be a string
  @IsNotEmpty() // Company name cannot be empty
  companyName: string;

  @IsString() // Must be a string
  @IsNotEmpty() // SIRET field cannot be empty
  @Length(14, 14, {
    message: 'Le numéro SIRET doit contenir exactement 14 chiffres.',
  }) // SIRET must be exactly 14 characters
  siret: string;
}
