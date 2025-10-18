// src/swipes/swipes.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SwipeActorType, SwipeDirection } from '@prisma/client';

@Injectable()
export class SwipesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un swipe et vérifie s'il y a un match.
   */
  async createSwipe(userId: string, dto: CreateSwipeDto) {
    // 1. Identifier l'acteur (qui swipe ?)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    const { jobOfferId, direction } = dto;

    // 2. Gérer le swipe du CANDIDAT
    if (user.candidateProfile) {
      if (dto.candidateId) {
        throw new BadRequestException('Un candidat ne peut pas spécifier de candidateId.');
      }
      const candidateId = user.candidateProfile.id;
      return this.processSwipe(
        candidateId,
        jobOfferId,
        SwipeActorType.CANDIDATE,
        direction,
      );
    }
    
    // 3. Gérer le swipe du RECRUTEUR
    else if (user.recruiterProfile) {
      if (!dto.candidateId) {
        throw new BadRequestException('Un recruteur doit spécifier un candidateId.');
      }
      const recruiterId = user.recruiterProfile.id;
      const candidateId = dto.candidateId;
      return this.processSwipe(
        candidateId,
        jobOfferId,
        SwipeActorType.RECRUITER,
        direction,
        recruiterId,
      );
    }
    
    else {
      throw new ForbiddenException("L'utilisateur n'a pas de profil actif.");
    }
  }

  /**
   * Moteur de logique de swipe et de matching.
   */
  private async processSwipe(
    candidateId: string,
    jobId: string,
    actorType: SwipeActorType,
    direction: SwipeDirection,
    recruiterId?: string,
  ) {
    // Crée le "demi-swipe"
    const newSwipe = await this.prisma.swipe.create({
      data: {
        candidateId: candidateId,
        jobId: jobId,
        actorType: actorType,
        direction: direction,
        recruiterId: recruiterId || null, // Sera null si c'est le candidat qui swipe
      },
    });

    // Si c'est un swipe GAUCHE, on s'arrête là. Pas de match.
    if (direction === 'LEFT') {
      return { match: false };
    }

    // SI C'EST UN SWIPE DROIT, ON CHERCHE L'AUTRE DEMI-SWIPE
    const otherActorType =
      actorType === 'CANDIDATE'
        ? SwipeActorType.RECRUITER
        : SwipeActorType.CANDIDATE;

    const otherSwipe = await this.prisma.swipe.findUnique({
      where: {
        // On utilise l'index unique de ton schéma !
        candidateId_jobId_actorType: {
          candidateId: candidateId,
          jobId: jobId,
          actorType: otherActorType,
        },
      },
    });

    // S'il n'y a pas d'autre swipe, ou si l'autre a swipé GAUCHE...
    if (!otherSwipe || otherSwipe.direction === 'LEFT') {
      return { match: false }; // Pas de match.
    }

    // --- C'EST UN MATCH ! ---
    // Les deux ont swipé DROIT (le nouveau et l'ancien)
    const matchedAt = new Date();

    // On met à jour les deux lignes de swipe pour les marquer comme "matchées"
    await this.prisma.swipe.update({
      where: { id: newSwipe.id },
      data: { isMatch: true, matchedAt: matchedAt },
    });
    
    await this.prisma.swipe.update({
      where: { id: otherSwipe.id },
      data: { isMatch: true, matchedAt: matchedAt },
    });

    // (Ici, on ajoutera l'émission de la notification B5.2)

    return { match: true, matchedAt: matchedAt };
  }
}
