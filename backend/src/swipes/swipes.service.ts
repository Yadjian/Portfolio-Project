// src/swipes/swipes.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SwipeDirection } from '@prisma/client';

@Injectable()
export class SwipesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gère un swipe (création ou mise à jour) et vérifie les matchs.
   */
  async handleSwipe(userId: string, dto: CreateSwipeDto) {
    const { profileId: swipedProfileId, direction } = dto;

    // 1. Identifier qui est le swiper (Candidat ou Recruteur)
    const swiperUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    if (!swiperUser) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    let candidateId: string;
    let recruiterId: string;
    let swiperDirectionField: 'candidateDirection' | 'recruiterDirection';
    let otherDirectionField: 'candidateDirection' | 'recruiterDirection';

    // 2. Déterminer les rôles
    if (swiperUser.candidateProfile) {
      // C'est un CANDIDAT qui swipe
      candidateId = swiperUser.candidateProfile.id;
      recruiterId = swipedProfileId; // L'ID reçu est celui d'un recruteur
      swiperDirectionField = 'candidateDirection';
      otherDirectionField = 'recruiterDirection';
    } else if (swiperUser.recruiterProfile) {
      // C'est un RECRUTEUR qui swipe
      candidateId = swipedProfileId; // L'ID reçu est celui d'un candidat
      recruiterId = swiperUser.recruiterProfile.id;
      swiperDirectionField = 'recruiterDirection';
      otherDirectionField = 'candidateDirection';
    } else {
      throw new ForbiddenException("L'utilisateur n'a pas de profil actif.");
    }

    // 3. Trouver la ligne de Swipe existante (ou la créer)
    // C'est la magie de `upsert` :
    // - Tente de trouver un swipe unique pour ce couple.
    // - S'il existe, on le met à jour (UPDATE).
    // - S'il n'existe pas, on le crée (CREATE).
    const swipe = await this.prisma.swipe.upsert({
      where: {
        // L'index unique de notre schéma
        candidateId_recruiterId: {
          candidateId: candidateId,
          recruiterId: recruiterId,
        },
      },
      // 4. METTRE À JOUR (s'il existe)
      update: {
        [swiperDirectionField]: direction, // Met à jour le swipe de l'acteur
      },
      // 5. CRÉER (s'il n'existe pas)
      create: {
        candidateId: candidateId,
        recruiterId: recruiterId,
        [swiperDirectionField]: direction, // Définit le premier swipe
      },
    });

    // 6. VÉRIFIER LE MATCH
    // On doit re-vérifier la donnée après l'upsert
    const updatedSwipe = await this.prisma.swipe.findUnique({
      where: { id: swipe.id },
    });

    // Un match se produit SI les DEUX ont swipé 'RIGHT'
    if (
      updatedSwipe.candidateDirection === 'RIGHT' &&
      updatedSwipe.recruiterDirection === 'RIGHT'
    ) {
      // C'est un MATCH !
      await this.prisma.swipe.update({
        where: { id: updatedSwipe.id },
        data: {
          isMatch: true,
          matchedAt: new Date(),
        },
      });

      // (Ici, on ajoutera l'émission de la notification B5.2)
      return { match: true, matchedAt: updatedSwipe.matchedAt };
    }

    // Pas de match (ou l'un a swipé 'LEFT')
    return { match: false };
  }
}
