// Fichier: backend/src/companies/dto/create-company-onboarding.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCompanyOnboardingDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'Le numéro SIRET doit contenir exactement 14 chiffres.' })
  siret: string;
}
