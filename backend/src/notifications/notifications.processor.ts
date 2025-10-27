// src/notifications/notifications.processor.ts
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import {
  SWIPE_NOTIFICATION_QUEUE,
  MATCH_NOTIFICATION_QUEUE,
} from './notifications.module';

@Processor('swipe-notification')
export class SwipeNotificationsProcessor extends WorkerHost {
  constructor() {
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

  // --- Ta méthode spécifique pour 'candidate-swipe-right' ---
  // @Process('candidate-swipe-right') // Le décorateur @Process ici n'est plus strictement nécessaire si appelé depuis process()
  async handleCandidateSwipe(job: Job<any>) {
    console.log(`[${SWIPE_NOTIFICATION_QUEUE}] Processing job ${job.id} (candidate-swipe-right)`);
    console.log('Data:', job.data);
    console.log(`-> Notifying recruiter ${job.data.recruiterId} for candidate ${job.data.candidateId}`);
    // TODO: Add push notification logic here
  }
}

@Processor('match-notification')
export class MatchNotificationsProcessor extends WorkerHost {
  constructor() {
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

  // --- Tes méthodes spécifiques ---
  async handleMatchCandidate(job: Job<any>) {
    console.log(`[${MATCH_NOTIFICATION_QUEUE}] Processing job ${job.id} (new-match-candidate)`);
    console.log('Data:', job.data);
    console.log(`-> Notifying candidate ${job.data.candidateId} of match with ${job.data.recruiterId}`);
    // TODO: Add push notification logic here
  }

  async handleMatchRecruiter(job: Job<any>) {
    console.log(`[${MATCH_NOTIFICATION_QUEUE}] Processing job ${job.id} (new-match-recruiter)`);
    console.log('Data:', job.data);
    console.log(`-> Notifying recruiter ${job.data.recruiterId} of match with ${job.data.candidateId}`);
    // TODO: Add push notification logic here
  }
}
