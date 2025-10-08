// Fichier: backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { JobOfferModule } from './job-offer/job-offer.module';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, JobOfferModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}