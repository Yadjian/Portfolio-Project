// This file defines BullMQ processors for handling swipe and match notification jobs.
// Each processor listens to a queue and sends push notifications via Firebase when jobs are received.

import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { FirebaseService } from 'src/firebase/firebase.service'; // Service for sending push notifications
import { PrismaService } from 'src/prisma/prisma.service'; // Service for database access
import {
  SWIPE_NOTIFICATION_QUEUE,
  MATCH_NOTIFICATION_QUEUE,
} from './notifications.module';

@Processor('swipe-notification')
// Processor for handling swipe notification jobs (e.g., when a candidate swipes right on a recruiter)
export class SwipeNotificationsProcessor extends WorkerHost {
  constructor(
    private readonly firebaseService: FirebaseService, // Injected Firebase service
    private readonly prisma: PrismaService, // Injected Prisma service
  ) {
    super();
  }

  // Abstract method required by WorkerHost: processes incoming jobs from the queue
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'candidate-swipe-right':
        return this.handleCandidateSwipe(job); // Handle candidate swipe right event
      default:
        console.warn(
          `[${SWIPE_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`,
        );
        break;
    }
  }

  // Handles the logic for when a candidate swipes right on a recruiter
  async handleCandidateSwipe(job: Job<any>) {
    const { candidateId, recruiterId } = job.data;

    try {
      // Find the recruiter's push token
      const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { pushToken: true }, // Only need the push token
      });
      // Find the candidate's first name for the notification message
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { firstName: true },
      });

      if (recruiterProfile?.pushToken && candidateProfile) {
        // Send the notification via Firebase
        await this.firebaseService.sendPushNotification(
          recruiterProfile.pushToken,
          'Nouveau Swipe !', // Notification title
          `${candidateProfile.firstName} est intéressé(e) par votre profil !`, // Notification body
          { type: 'new_swipe', candidateId: candidateId }, // Optional data for the frontend
        );
      } else {
        console.warn(
          `Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`,
        );
      }
    } catch (error) {
      console.error(
        `Error processing job ${job.id} (candidate-swipe-right):`,
        error,
      );
      // Handle the error (e.g., retry the job later)
    }
  }
}

@Processor('match-notification')
// Processor for handling match notification jobs (e.g., when a match occurs between candidate and recruiter)
export class MatchNotificationsProcessor extends WorkerHost {
  constructor(
    private readonly firebaseService: FirebaseService, // Injected Firebase service
    private readonly prisma: PrismaService, // Injected Prisma service
  ) {
    super();
  }

  // Abstract method required by WorkerHost: processes incoming jobs from the queue
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'new-match-candidate':
        return this.handleMatchCandidate(job); // Notify candidate of a new match
      case 'new-match-recruiter':
        return this.handleMatchRecruiter(job); // Notify recruiter of a new match
      default:
        console.warn(
          `[${MATCH_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`,
        );
        break;
    }
  }

  // Sends a push notification to the candidate when a new match occurs
  async handleMatchCandidate(job: Job<any>) {
    const { candidateId, recruiterId } = job.data;

    try {
      // Find the candidate's push token
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { pushToken: true },
      });
      // Find the recruiter's first name for the notification message
      const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { firstName: true },
      });

      if (candidateProfile?.pushToken && recruiterProfile) {
        await this.firebaseService.sendPushNotification(
          candidateProfile.pushToken,
          'Nouveau Match !', // Notification title
          `Vous avez matché avec ${recruiterProfile.firstName} ! Consultez vos matchs.`, // Notification body
          { type: 'new_match', recruiterId: recruiterId }, // Optional data for the frontend
        );
      } else {
        console.warn(
          `Candidate ${candidateId} has no push token or recruiter ${recruiterId} not found.`,
        );
      }
    } catch (error) {
      console.error(
        `Error processing job ${job.id} (new-match-candidate):`,
        error,
      );
    }
  }

  // Sends a push notification to the recruiter when a new match occurs
  async handleMatchRecruiter(job: Job<any>) {
    const { candidateId, recruiterId } = job.data;

    try {
      // Find the recruiter's push token
      const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { pushToken: true },
      });
      // Find the candidate's first name for the notification message
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { firstName: true },
      });

      if (recruiterProfile?.pushToken && candidateProfile) {
        await this.firebaseService.sendPushNotification(
          recruiterProfile.pushToken,
          'Nouveau Match !', // Notification title
          `Vous avez matché avec ${candidateProfile.firstName} ! Consultez vos matchs.`, // Notification body
          { type: 'new_match', candidateId: candidateId }, // Optional data for the frontend
        );
      } else {
        console.warn(
          `Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`,
        );
      }
    } catch (error) {
      console.error(
        `Error processing job ${job.id} (new-match-recruiter):`,
        error,
      );
    }
  }
}
