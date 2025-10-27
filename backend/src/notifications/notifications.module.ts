// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { SwipeNotificationsProcessor, MatchNotificationsProcessor } from './notifications.processor'; // ✅ Import des 2 processors

export const SWIPE_NOTIFICATION_QUEUE = 'swipe-notification';
export const MATCH_NOTIFICATION_QUEUE = 'match-notification';

// Optionnel: Définir les options Redis ici pour être explicite
const redisOptions = {
  host: 'redis',
  port: 6379,
};

@Module({
  imports: [PrismaModule, FirebaseModule,
    BullModule.registerQueue({
      name: SWIPE_NOTIFICATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: MATCH_NOTIFICATION_QUEUE,
    }),
  ],
  providers: [
    SwipeNotificationsProcessor,  // ✅ AJOUTEZ CECI
    MatchNotificationsProcessor,  // ✅ AJOUTEZ CECI
  ],
  exports: [BullModule],
})
export class NotificationsModule {}
