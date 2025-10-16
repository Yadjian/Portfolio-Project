// src/auth/dto/signup.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';

// On définit les rôles possibles pour éviter les erreurs de frappe
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
}

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères.' })
  password: string;

  // AJOUTÉ : Le rôle que l'utilisateur a choisi
  @IsIn([UserRole.CANDIDATE, UserRole.RECRUITER])
  @IsNotEmpty()
  role: UserRole;
}
