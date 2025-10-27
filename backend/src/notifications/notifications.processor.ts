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
    console.log(`[swipe-notification] Processing job ${job.id} (candidate-swipe-right)`);
    const { candidateId, recruiterId } = job.data;

    try {
      // Trouve le recruteur et son token
      const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
        where: { id: recruiterId },
        select: { pushToken: true } // On a juste besoin du token
      });
      // Trouve le nom du candidat pour le message
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
          where: { id: candidateId },
          select: { firstName: true }
      });

      if (recruiterProfile?.pushToken && candidateProfile) {
        // Envoie la notification via Firebase
        await this.firebaseService.sendPushNotification(
          recruiterProfile.pushToken,
          'Nouveau Swipe ! 👍', // Titre
          `${candidateProfile.firstName} est intéressé(e) par votre profil !`, // Corps
          { type: 'new_swipe', candidateId: candidateId } // Données pour le front (optionnel)
        );
      } else {
        console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.id} (candidate-swipe-right):`, error);
      // Gérer l'erreur (ex: relancer le job plus tard ?)
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
    console.log(`[match-notification] Processing job ${job.id} (new-match-candidate)`);
    const { candidateId, recruiterId } = job.data;

    try {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { id: candidateId },
            select: { pushToken: true }
        });
        const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { id: recruiterId },
            select: { firstName: true } // Nom pour le message
        });

        if (candidateProfile?.pushToken && recruiterProfile) {
            await this.firebaseService.sendPushNotification(
                candidateProfile.pushToken,
                '🎉 Nouveau Match !',
                `Vous avez matché avec ${recruiterProfile.firstName} ! Consultez vos matchs.`,
                { type: 'new_match', recruiterId: recruiterId } // Données pour le front
            );
        } else {
            console.warn(`Candidate ${candidateId} has no push token or recruiter ${recruiterId} not found.`);
        }
    } catch (error) {
        console.error(`Error processing job ${job.id} (new-match-candidate):`, error);
    }
  }

  async handleMatchRecruiter(job: Job<any>) {
     console.log(`[match-notification] Processing job ${job.id} (new-match-recruiter)`);
     const { candidateId, recruiterId } = job.data;

     try {
         const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
            where: { id: recruiterId },
            select: { pushToken: true }
         });
         const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { id: candidateId },
            select: { firstName: true } // Nom pour le message
         });

         if (recruiterProfile?.pushToken && candidateProfile) {
              await this.firebaseService.sendPushNotification(
                 recruiterProfile.pushToken,
                 '🎉 Nouveau Match !',
                 `Vous avez matché avec ${candidateProfile.firstName} ! Consultez vos matchs.`,
                 { type: 'new_match', candidateId: candidateId } // Données pour le front
              );
         } else {
             console.warn(`Recruiter ${recruiterId} has no push token or candidate ${candidateId} not found.`);
         }
     } catch (error) {
         console.error(`Error processing job ${job.id} (new-match-recruiter):`, error);
     }
  }
}
