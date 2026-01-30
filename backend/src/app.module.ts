// Fichier: backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { JobOfferModule } from './job-offer/job-offer.module';
import { CompaniesModule } from './companies/companies.module';
import { MetaModule } from './meta/meta.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { SwipesModule } from './swipes/swipes.module';
import { MatchesModule } from './matches/matches.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { AdminModule } from './admin/admin.module';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // ✅ 1. BULL CONFIGURATION EN PREMIER
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),

    // ✅ 2. MODULES DE BASE
    AuthModule,
    PrismaModule,

    // ✅ 3. MODULES MÉTIER
    ProfileModule,
    SwipesModule,
    JobOfferModule,
    CompaniesModule,
    MetaModule,
    DiscoveryModule,
    MatchesModule,
    FileStorageModule,
    AdminModule,

    // ✅ 4. NOTIFICATIONS MODULE (APRÈS BullModule.forRoot)
    NotificationsModule,

    // ✅ 5. MODULES TECHNIQUES
    MulterModule.register({
      dest: './uploads',
    }),

    FirebaseModule,

    // ✅ 6. THROTTLE MODULE
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 10, // 10 requêtes par minute
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 5, // 5 tentatives de connexion par 15min
      },
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 🔒 Protection globale
    },
  ],
})
export class AppModule {}
