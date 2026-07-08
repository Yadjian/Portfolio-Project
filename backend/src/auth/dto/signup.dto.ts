// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsIn,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
}

export class SignupDto {
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @MaxLength(254, { message: "L'email ne peut pas dépasser 254 caractères" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @MaxLength(72, {
    message: 'Le mot de passe ne peut pas dépasser 72 caractères',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.',
  })
  password: string;

  @IsIn([UserRole.CANDIDATE, UserRole.RECRUITER], {
    message: 'Le rôle doit être CANDIDATE ou RECRUITER',
  })
  @IsNotEmpty({ message: 'Le rôle est obligatoire' })
  @Transform(({ value }) => value?.toUpperCase())
  role: UserRole;
}
