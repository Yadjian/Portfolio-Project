// src/discovery/discovery.module.ts

import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { JobOfferModule } from 'src/job-offer/job-offer.module';
import { DiscoveryService } from './discovery.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- 2. Importer Prisma

@Module({
  imports: [JobOfferModule, PrismaModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService]
})
export class DiscoveryModule {}
