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

const getBullImports = () => {
  // Skip BullModule in test environment to avoid Redis dependency
  if (process.env.NODE_ENV === 'test') {
    return [];
  }
  return [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
  ];
};

@Module({
  imports: [
    ...getBullImports(),
    // Core modules
    AuthModule,
    PrismaModule,
    // Feature modules
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
    // File upload configuration
    MulterModule.register({
      dest: './uploads',
    }),
    FirebaseModule,
    // Rate limiting for all routes
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 500, // 500 requests per minute (app mobile avec polling actif)
      },
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
