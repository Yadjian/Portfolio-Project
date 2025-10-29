// This module bundles all notification-related components and dependencies, including queue processors for swipe and match notifications.

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { SwipeNotificationsProcessor, MatchNotificationsProcessor } from './notifications.processor'; // Import both processors

export const SWIPE_NOTIFICATION_QUEUE = 'swipe-notification';
export const MATCH_NOTIFICATION_QUEUE = 'match-notification';

// Optional: Define Redis options explicitly for clarity
const redisOptions = {
  host: 'redis',
  port: 6379,
};

@Module({
  // Import required modules: Prisma for DB access, Firebase for push notifications, Bull for job queues
  imports: [
    PrismaModule,
    FirebaseModule,
    // Register Bull queues for swipe and match notifications
    BullModule.registerQueue({
      name: SWIPE_NOTIFICATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: MATCH_NOTIFICATION_QUEUE,
    }),
  ],
  // Register notification processors as providers
  providers: [
    SwipeNotificationsProcessor,
    MatchNotificationsProcessor,
  ],
  // Export BullModule so other modules can use the queues
  exports: [BullModule],
})
export class NotificationsModule {}
