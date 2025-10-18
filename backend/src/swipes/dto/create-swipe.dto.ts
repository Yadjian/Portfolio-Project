// src/swipes/dto/create-swipe.dto.ts
import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { SwipeDirection } from '@prisma/client'; // Importe l'enum de Prisma

export class CreateSwipeDto {
  @IsUUID()
  jobOfferId: string;

  @IsEnum(SwipeDirection)
  direction: SwipeDirection; // Doit être 'LEFT' ou 'RIGHT'

  // Ce champ est OPTIONNEL
  // Il ne sera fourni que par un RECRUTEUR qui swipe sur un candidat
  @IsUUID()
  @IsOptional()
  candidateId?: string;
}
