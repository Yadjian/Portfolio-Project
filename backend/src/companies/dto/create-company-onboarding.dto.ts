// Fichier: backend/src/companies/dto/create-company-onboarding.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyOnboardingDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  siret: string;
}
