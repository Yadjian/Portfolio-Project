// src/swipes/dto/create-swipe.dto.ts
import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { SwipeDirection } from '@prisma/client'; // Importe l'enum de Prisma

export class CreateSwipeDto {

  /**
   * L'ID du profil de la personne sur laquelle on swipe.
   * Si je suis Candidat, ce sera un recruiterId.
   * Si je suis Recruteur, ce sera un candidateId.
   */
  @IsUUID()
  profileId: string;

  @IsEnum(SwipeDirection)
  direction: SwipeDirection; // Doit être 'LEFT' ou 'RIGHT'
}
