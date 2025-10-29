// src/swipes/swipes.service.ts
// This service handles the business logic for swipe actions (like/dislike) between users,
// including creating/updating swipes, checking for matches, and undoing the last swipe.

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

    @InjectQueue(SWIPE_NOTIFICATION_QUEUE) private swipeQueue: Queue,
    @InjectQueue(MATCH_NOTIFICATION_QUEUE) private matchQueue: Queue,
  ) {}

  /**
   * Handles a swipe action (create or update) and checks for matches.
   * @param userId The ID of the user performing the swipe
   * @param dto The swipe data (profileId and direction)
   */
  async handleSwipe(userId: string, dto: CreateSwipeDto) {
    const { profileId: swipedProfileId, direction } = dto;

    // 1. Identify the swiper (Candidate or Recruiter)
    const swiperUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    if (!swiperUser) {
      throw new NotFoundException('User not found.');
    }

    let candidateId: string;
    let recruiterId: string;
    let swiperDirectionField: 'candidateDirection' | 'recruiterDirection';
    let otherDirectionField: 'candidateDirection' | 'recruiterDirection';

    // 2. Determine the roles based on the swiper's profile
    if (swiperUser.candidateProfile) {
      // The swiper is a CANDIDATE
      candidateId = swiperUser.candidateProfile.id;
      recruiterId = swipedProfileId; // The provided ID is a recruiter
      swiperDirectionField = 'candidateDirection';
      otherDirectionField = 'recruiterDirection';
    } else if (swiperUser.recruiterProfile) {
      // The swiper is a RECRUITER
      candidateId = swipedProfileId; // The provided ID is a candidate
      recruiterId = swiperUser.recruiterProfile.id;
      swiperDirectionField = 'recruiterDirection';
      otherDirectionField = 'candidateDirection';
    } else {
      throw new ForbiddenException("User does not have an active profile.");
    }

    // 3. Find or create the Swipe record using upsert
    // - If it exists, update the swiper's direction
    // - If it doesn't exist, create it with the swiper's direction
    const swipe = await this.prisma.swipe.upsert({
      where: {
        candidateId_recruiterId: {
          candidateId,
          recruiterId,
        },
      },
      update: {
        [swiperDirectionField]: direction,
      },
      create: {
        candidateId,
        recruiterId,
        [swiperDirectionField]: direction,
      },
    });

    // 4. Retrieve the updated swipe to check for a match
    const updatedSwipe = await this.prisma.swipe.findUnique({
      where: { id: swipe.id },
    });

    // === Notification and Match Logic ===

    // 1. If a CANDIDATE just swiped RIGHT and it's not already a match, notify the recruiter
    if (
      swiperDirectionField === 'candidateDirection' &&
      direction === 'RIGHT' &&
      updatedSwipe.recruiterDirection !== 'RIGHT'
    ) {
      await this.swipeQueue.add('candidate-swipe-right', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        swipeId: updatedSwipe.id,
      });
      // Notification job added for recruiter
    }

    // 2. If both candidate and recruiter swiped RIGHT and it's not already marked as a match
    if (
      updatedSwipe.candidateDirection === 'RIGHT' &&
      updatedSwipe.recruiterDirection === 'RIGHT' &&
      !updatedSwipe.isMatch
    ) {
      // Mark as match and set matchedAt timestamp
      const matchData = await this.prisma.swipe.update({
        where: { id: updatedSwipe.id },
        data: { isMatch: true, matchedAt: new Date() },
      });

      // Notify both candidate and recruiter about the new match
      await this.matchQueue.add('new-match-candidate', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      });

      await this.matchQueue.add('new-match-recruiter', {
        candidateId: candidateId,
        recruiterId: recruiterId,
        matchId: matchData.id,
        matchedAt: matchData.matchedAt,
      });

      return { match: true, matchedAt: matchData.matchedAt };
    }

    // If no match occurred, return match: false
    return { match: false };
  }

  /**
   * Undoes the last swipe action for the authenticated user.
   * @param userId The ID of the user requesting the undo
   */
  async undoLastSwipe(userId: string) {
    // 1. Find the user's profile (candidate or recruiter)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    let lastSwipe;
    let directionField: 'candidateDirection' | 'recruiterDirection';

    // 2. Determine the role and find the last swipe
    if (user.candidateProfile) {
      // Candidate: find the last swipe where candidateDirection is not null
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
      // Recruiter: find the last swipe where recruiterDirection is not null
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
      throw new ForbiddenException("User does not have an active profile.");
    }

    if (!lastSwipe) {
      return { success: false, message: 'No swipe to undo.' };
    }

    // 3. Undo the swipe by setting the direction to null and removing the match if it existed
    await this.prisma.swipe.update({
      where: { id: lastSwipe.id },
      data: {
        [directionField]: null,
        isMatch: false,
        matchedAt: null,
      },
    });

    return { success: true };
  }
}
