import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
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

    @InjectQueue(SWIPE_NOTIFICATION_QUEUE) private swipeQueue: Queue, // Notification queue for swipes
    @InjectQueue(MATCH_NOTIFICATION_QUEUE) private matchQueue: Queue, // Notification queue for matches
  ) {}

  /**
   * Handles a swipe (creation or update) and verifies matches.
   */
  async handleSwipe(userId: string, dto: CreateSwipeDto) {
    // Validate user ID and swipe data
    if (!userId) {
      throw new BadRequestException('Utilisateur requis pour swiper.');
    }

    if (!dto?.profileId?.trim() || !dto?.direction) {
      throw new BadRequestException('ID de profil et direction requis.');
    }

    const { profileId: swipedProfileId, direction } = dto;

    // Security: Prevent self-swipe
    if (swipedProfileId === userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas swiper sur votre propre profil.',
      );
    }

    // Identify who is swiping (Candidate or Recruiter)
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

    // Determine roles
    if (swiperUser.candidateProfile) {
      // Candidate is swiping
      candidateId = swiperUser.candidateProfile.id;
      recruiterId = swipedProfileId; // Received ID is a recruiter profile
      swiperDirectionField = 'candidateDirection';
      otherDirectionField = 'recruiterDirection';

      // IDOR protection: Verify target is a valid recruiter profile
      const targetRecruiter = await this.prisma.recruiterProfile.findUnique({
        where: { id: swipedProfileId },
        select: { id: true },
      });
      if (!targetRecruiter) {
        console.warn(
          `Swipe security: Candidate ${userId} attempted invalid recruiter swipe`,
        );
        throw new NotFoundException('Profil recruteur introuvable.');
      }
    } else if (swiperUser.recruiterProfile) {
      // Recruiter is swiping
      candidateId = swipedProfileId; // Received ID is a candidate profile
      recruiterId = swiperUser.recruiterProfile.id;
      swiperDirectionField = 'recruiterDirection';
      otherDirectionField = 'candidateDirection';

      // IDOR protection: Verify target is a valid candidate profile
      const targetCandidate = await this.prisma.candidateProfile.findUnique({
        where: { id: swipedProfileId },
        select: { id: true },
      });
      if (!targetCandidate) {
        console.warn(
          `Swipe security: Recruiter ${userId} attempted invalid candidate swipe`,
        );
        throw new NotFoundException('Profil candidat introuvable.');
      }
    } else {
      throw new ForbiddenException("L'utilisateur n'a pas de profil actif.");
    }

    // Create or update swipe record using upsert
    // If exists: updates the swiper's direction
    // If not: creates new swipe with initial direction
    const swipe = await this.prisma.swipe.upsert({
      where: {
        // Unique constraint on candidate-recruiter pair
        candidateId_recruiterId: {
          candidateId,
          recruiterId,
        },
      },
      // Update if exists
      update: {
        [swiperDirectionField]: direction, // Updates the swiper's direction
      },
      // Create if not exists
      create: {
        candidateId,
        recruiterId,
        [swiperDirectionField]: direction, // Sets the first swipe direction
      },
    });

    // Verify match state after upsert
    const updatedSwipe = await this.prisma.swipe.findUnique({
      where: { id: swipe.id },
    });

    // Add to notification queues

    // If candidate just swiped RIGHT and no match yet
    if (
      swiperDirectionField === 'candidateDirection' &&
      direction === 'RIGHT' &&
      updatedSwipe.recruiterDirection !== 'RIGHT' // No match yet
    ) {
      await this.swipeQueue.add('candidate-swipe-right', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        swipeId: updatedSwipe.id,
      });
      console.log(
        `Job added to ${SWIPE_NOTIFICATION_QUEUE}: candidate-swipe-right`,
      );
    }

    // If match just occurred
    if (
      updatedSwipe.candidateDirection === 'RIGHT' &&
      updatedSwipe.recruiterDirection === 'RIGHT' &&
      !updatedSwipe.isMatch // Ensure match is only processed once
    ) {
      // Mark as match
      const matchData = await this.prisma.swipe.update({
        where: { id: updatedSwipe.id },
        data: { isMatch: true, matchedAt: new Date() },
      });

      await this.matchQueue.add('new-match-candidate', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      });
      console.log(
        `Job added to ${MATCH_NOTIFICATION_QUEUE}: new-match-candidate`,
      );

      await this.matchQueue.add('new-match-recruiter', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      });
      console.log(
        `Job added to ${MATCH_NOTIFICATION_QUEUE}: new-match-recruiter`,
      );

      return { match: true, matchedAt: matchData.matchedAt };
    }

    // Audit logging
    console.log(
      `Swipe authorized: ${direction} by user ${userId} on profile ${swipedProfileId}`,
    );

    return { match: false };
  }

  /**
   * Undo the user's last swipe action
   */
  async undoLastSwipe(userId: string) {
    // Validate user ID
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

    // Determine role and find last swipe
    if (user.candidateProfile) {
      // Candidate: find last swipe
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
      // Recruiter: find last swipe
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

    // Undo swipe by setting direction to null
    await this.prisma.swipe.update({
      where: { id: lastSwipe.id },
      data: {
        [directionField]: null,
        // If it was a match, undo it
        isMatch: false,
        matchedAt: null,
      },
    });

    // Audit logging
    console.log(`Swipe undo authorized: ${lastSwipe.id} by user ${userId}`);

    return { success: true };
  }
}
