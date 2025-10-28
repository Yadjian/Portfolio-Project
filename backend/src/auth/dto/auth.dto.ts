// src/auth/dto/auth.dto.ts - VERSION RENFORCÉE
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthDto {
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @MaxLength(254, { message: 'L\'email ne peut pas dépasser 254 caractères' })
  @Transform(({ value }) => value?.toLowerCase().trim()) // 🔒 Auto-nettoyage
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères.' }) // ✅ GARDE VOS 6 chars
  @MaxLength(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' }) // 🔒 Protection débordement
  password: string;
}
