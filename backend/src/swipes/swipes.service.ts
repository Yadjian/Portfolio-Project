// src/swipes/swipes.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq'; // <-- COMMENTE
import { Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import {
  SWIPE_NOTIFICATION_QUEUE,
  MATCH_NOTIFICATION_QUEUE,
} from 'src/notifications/notifications.module';

@Injectable()
export class SwipesService {
  constructor(
    private prisma: PrismaService,

    @InjectQueue(SWIPE_NOTIFICATION_QUEUE) private swipeQueue: Queue,
    @InjectQueue(MATCH_NOTIFICATION_QUEUE) private matchQueue: Queue,
  ) {}

  /**
   * Gère un swipe (création ou mise à jour) et vérifie les matchs.
   */
  async handleSwipe(userId: string, dto: CreateSwipeDto) {
    // 🔒 Validation sécurisée des entrées
    if (!userId) {
      throw new BadRequestException('Utilisateur requis pour swiper.');
    }

    if (!dto?.profileId?.trim() || !dto?.direction) {
      throw new BadRequestException('ID de profil et direction requis.');
    }

    const { profileId: swipedProfileId, direction } = dto;

    // 🛡️ SÉCURITÉ : Empêcher l'auto-swipe
    if (swipedProfileId === userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas swiper sur votre propre profil.',
      );
    }

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

      // 🛡️ SÉCURITÉ : Vérifier que le profil swipé est bien un recruteur
      const targetRecruiter = await this.prisma.recruiterProfile.findUnique({
        where: { id: swipedProfileId },
        select: { id: true },
      });
      if (!targetRecruiter) {
        console.warn(
          `🚨 SWIPE SECURITY: Candidate ${userId} tried to swipe on invalid recruiter ${swipedProfileId}`,
        );
        throw new NotFoundException('Profil recruteur introuvable.');
      }
    } else if (swiperUser.recruiterProfile) {
      // C'est un RECRUTEUR qui swipe
      candidateId = swipedProfileId; // L'ID reçu est celui d'un candidat
      recruiterId = swiperUser.recruiterProfile.id;
      swiperDirectionField = 'recruiterDirection';
      otherDirectionField = 'candidateDirection';

      // 🛡️ SÉCURITÉ : Vérifier que le profil swipé est bien un candidat
      const targetCandidate = await this.prisma.candidateProfile.findUnique({
        where: { id: swipedProfileId },
        select: { id: true },
      });
      if (!targetCandidate) {
        console.warn(
          `🚨 SWIPE SECURITY: Recruiter ${userId} tried to swipe on invalid candidate ${swipedProfileId}`,
        );
        throw new NotFoundException('Profil candidat introuvable.');
      }
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
          candidateId,
          recruiterId,
        },
      },
      // 4. METTRE À JOUR (s'il existe)
      update: {
        [swiperDirectionField]: direction, // Met à jour le swipe de l'acteur
      },
      // 5. CRÉER (s'il n'existe pas)
      create: {
        candidateId,
        recruiterId,
        [swiperDirectionField]: direction, // Définit le premier swipe
      },
    });

    // 6. VÉRIFIER LE MATCH
    // On doit re-vérifier la donnée après l'upsert
    const updatedSwipe = await this.prisma.swipe.findUnique({
      where: { id: swipe.id },
    });

    // === Logique d'ajout de Job ===

    // 1. Si un CANDIDAT vient de swiper RIGHT (et que ce n'est pas déjà un match)
    if (
      swiperDirectionField === 'candidateDirection' &&
      direction === 'RIGHT' &&
      updatedSwipe.recruiterDirection !== 'RIGHT' // Pas encore de match
    ) {
      await this.swipeQueue.add('candidate-swipe-right', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        swipeId: updatedSwipe.id,
      }); // <-- COMMENTE
      console.log(
        `Job ajouté à ${SWIPE_NOTIFICATION_QUEUE}: candidate-swipe-right`,
      ); // <-- COMMENTE
    }

    // 2. Si un MATCH vient de se produire
    if (
      updatedSwipe.candidateDirection === 'RIGHT' &&
      updatedSwipe.recruiterDirection === 'RIGHT' &&
      !updatedSwipe.isMatch // S'assure qu'on ne le fait qu'une fois
    ) {
      // Marquer comme match (ta logique existante)
      const matchData = await this.prisma.swipe.update({
        where: { id: updatedSwipe.id },
        data: { isMatch: true, matchedAt: new Date() },
      });

      await this.matchQueue.add('new-match-candidate', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      }); // <-- COMMENTE
      console.log(
        `Job ajouté à ${MATCH_NOTIFICATION_QUEUE}: new-match-candidate`,
      ); // <-- COMMENTE

      await this.matchQueue.add('new-match-recruiter', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      }); // <-- COMMENTE
      console.log(
        `Job ajouté à ${MATCH_NOTIFICATION_QUEUE}: new-match-recruiter`,
      ); // <-- COMMENTE

      return { match: true, matchedAt: matchData.matchedAt };
    }

    // 🔒 Log de sécurité pour audit
    console.log(
      `✅ Swipe authorized: ${direction} by user ${userId} on profile ${swipedProfileId}`,
    );

    // Si pas de match
    return { match: false };
  }

  /**
   * Annule le dernier swipe de l'utilisateur
   */
  async undoLastSwipe(userId: string) {
    // 🔒 Validation sécurisée des entrées
    if (!userId) {
      throw new BadRequestException(
        'Utilisateur requis pour annuler un swipe.',
      );
    }

    // 1. Trouver le profil de l'utilisateur
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

    let lastSwipe;
    let directionField: 'candidateDirection' | 'recruiterDirection';

    // 2. Déterminer le rôle et trouver le dernier swipe
    if (user.candidateProfile) {
      // Candidat : chercher le dernier swipe où candidateDirection n'est pas null
      lastSwipe = await this.prisma.swipe.findFirst({
        where: {
          candidateId: user.candidateProfile.id,
          candidateDirection: { not: null },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      directionField = 'candidateDirection';
    } else if (user.recruiterProfile) {
      // Recruteur : chercher le dernier swipe où recruiterDirection n'est pas null
      lastSwipe = await this.prisma.swipe.findFirst({
        where: {
          recruiterId: user.recruiterProfile.id,
          recruiterDirection: { not: null },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      directionField = 'recruiterDirection';
    } else {
      throw new ForbiddenException("L'utilisateur n'a pas de profil actif.");
    }

    if (!lastSwipe) {
      return { success: false, message: 'Aucun swipe à annuler.' };
    }

    // 3. Annuler le swipe en remettant la direction à null
    await this.prisma.swipe.update({
      where: { id: lastSwipe.id },
      data: {
        [directionField]: null,
        // Si c'était un match, on le défait
        isMatch: false,
        matchedAt: null,
      },
    });

    // 🔒 Log de sécurité pour audit
    console.log(`✅ Swipe undo authorized: ${lastSwipe.id} by user ${userId}`);

    return { success: true };
  }
}
