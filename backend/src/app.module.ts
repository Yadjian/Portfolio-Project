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

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, SwipesModule, JobOfferModule, CompaniesModule, MetaModule, DiscoveryModule, MatchesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}