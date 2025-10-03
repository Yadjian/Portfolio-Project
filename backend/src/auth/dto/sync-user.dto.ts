// Fichier: backend/src/auth/dto/sync-user.dto.ts

import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class SyncUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsIn(['candidate', 'recruiter']) // Le rôle doit être l'une de ces deux valeurs
  role: 'candidate' | 'recruiter';

  // Le nom de la compagnie est optionnel et ne sera fourni que si le rôle est 'recruteur'
  @IsOptional()
  @IsString()
  companyName?: string; 
}
