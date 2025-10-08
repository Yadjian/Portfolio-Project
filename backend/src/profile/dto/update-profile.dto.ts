// Fichier: backend/src/profile/dto/update-profile.dto.ts

import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  // Ajoutez d'autres champs que l'utilisateur peut modifier.
  // @IsOptional() signifie que le champ n'est pas obligatoire.
  @IsOptional()
  @IsString()
  desiredJobTitle?: string;
}
