// This file defines the JobOfferModule, which bundles all job offer related components and dependencies.

import { Module } from '@nestjs/common';
import { JobOffersController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  // Import PrismaModule for database access and AuthModule for authentication features
  imports: [PrismaModule, AuthModule],
  // Register the JobOffersController to handle job offer related routes
  controllers: [JobOffersController],
  // Register the JobOfferService to provide business logic for job offers
  providers: [JobOfferService]
})
export class JobOfferModule {}
