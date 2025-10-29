// This is the root module of the NestJS application. It imports and configures all feature modules and global services.

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

@Module({
  imports: [
    // Global BullMQ configuration for Redis-based queues (used for notifications, etc.)
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    // Import all feature modules for authentication, profiles, job offers, etc.
    AuthModule, 
    PrismaModule, 
    ProfileModule, 
    SwipesModule, 
    JobOfferModule, 
    CompaniesModule, 
    MetaModule, 
    DiscoveryModule, 
    MatchesModule, 
    FileStorageModule, 
    AdminModule,
    NotificationsModule,
    // MulterModule is used for handling file uploads (temporary upload folder)
    MulterModule.register({
      dest: './uploads', // Temporary folder for uploads
    }),
  ],
  // Register global controllers (main app and health check)
  controllers: [AppController, HealthController],
  // Register global providers (main app service)
  providers: [AppService],
})
export class AppModule {}