// src/notifications/notifications.processor.ts
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { FirebaseService } from 'src/firebase/firebase.service'; // <-- IMPORTE
import { PrismaService } from 'src/prisma/prisma.service';   // <-- IMPORTE
import {
  SWIPE_NOTIFICATION_QUEUE,
  MATCH_NOTIFICATION_QUEUE,
} from './notifications.module';

@Processor('swipe-notification')
export class SwipeNotificationsProcessor extends WorkerHost {
  constructor(
    private readonly firebaseService: FirebaseService, // <-- INJECTE
    private readonly prisma: PrismaService           // <-- INJECTE
  ) {
    super();
  }

  // --- 1. Implémente la méthode ABSTRAITE obligatoire ---
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[${SWIPE_NOTIFICATION_QUEUE}] Received job ${job.id} with name ${job.name}`);
    switch (job.name) {
      case 'candidate-swipe-right':
        return this.handleCandidateSwipe(job); // Appelle ta méthode existante
      default:
        console.warn(`[${SWIPE_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`);
        break;
    }
  }

  async handleCandidateSwipe(job: Job<any>) {
    console.log(`[${SWIPE_NOTIFICATION_QUEUE}] Processing job ${job.id} (candidate-swipe-right)`);
    const { candidateId, recruiterId } = job.data;

    // Trouve le recruteur et son token
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { id: recruiterId },
      select: { pushToken: true, firstName: true } // On récupère aussi le nom pour personnaliser
    });
    // Trouve le nom du candidat
     const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { firstName: true }
    });


    if (recruiterProfile?.pushToken && candidateProfile) {
      await this.firebaseService.sendPushNotification(
        recruiterProfile.pushToken,
        'Nouveau Swipe !',
        `${candidateProfile.firstName} est intéressé(e) ! Swiper maintenant ?`,
        { type: 'new_swipe', candidateId: candidateId } // Données utiles pour le front
      );
    } else {
        console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
    }
  }
}

@Processor('match-notification')
export class MatchNotificationsProcessor extends WorkerHost {
   constructor(
    private readonly firebaseService: FirebaseService, // <-- INJECTE
    private readonly prisma: PrismaService           // <-- INJECTE
  ) {
    super();
  }

  // --- 2. Implémente la méthode ABSTRAITE obligatoire ---
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[${MATCH_NOTIFICATION_QUEUE}] Received job ${job.id} with name ${job.name}`);
    switch (job.name) {
      case 'new-match-candidate':
        return this.handleMatchCandidate(job);
      case 'new-match-recruiter':
        return this.handleMatchRecruiter(job);
      default:
        console.warn(`[${MATCH_NOTIFICATION_QUEUE}] Unhandled job name: ${job.name}`);
        break;
    }
  }

  async handleMatchCandidate(job: Job<any>) {
    console.log(`[${MATCH_NOTIFICATION_QUEUE}] Processing job ${job.id} (new-match-candidate)`);
    const { candidateId, recruiterId } = job.data;
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { pushToken: true }
    });
     const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { firstName: true }
    });

    if (candidateProfile?.pushToken && recruiterProfile) {
         await this.firebaseService.sendPushNotification(
            candidateProfile.pushToken,
            '🎉 Nouveau Match !',
            `Vous avez matché avec ${recruiterProfile.firstName} ! Voir les offres.`,
             { type: 'new_match', recruiterId: recruiterId }
         );
    } else {
         console.warn(`Candidate ${candidateId} has no push token or recruiter ${recruiterId} not found.`);
    }
  }

  async handleMatchRecruiter(job: Job<any>) {
     console.log(`[${MATCH_NOTIFICATION_QUEUE}] Processing job ${job.id} (new-match-recruiter)`);
     const { candidateId, recruiterId } = job.data;
     const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { pushToken: true }
     });
     const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        select: { firstName: true }
     });

     if (recruiterProfile?.pushToken && candidateProfile) {
          await this.firebaseService.sendPushNotification(
             recruiterProfile.pushToken,
             '🎉 Nouveau Match !',
             `Vous avez matché avec ${candidateProfile.firstName} ! Voir le profil.`,
              { type: 'new_match', candidateId: candidateId }
          );
     } else {
         console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
     }
  }
}
