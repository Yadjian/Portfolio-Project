// This file defines the DiscoveryModule, which bundles all discovery-related components and dependencies.

import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { JobOfferModule } from 'src/job-offer/job-offer.module'; // Import JobOfferModule for job offer features
import { DiscoveryService } from './discovery.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import PrismaModule to enable database access

@Module({
  // Import required modules for discovery features and database access
  imports: [JobOfferModule, PrismaModule],
  // Register the DiscoveryController to handle discovery-related routes
  controllers: [DiscoveryController],
  // Register the DiscoveryService to provide business logic for discovery operations
  providers: [DiscoveryService]
})
export class DiscoveryModule {}
