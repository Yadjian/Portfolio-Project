// src/discovery/discovery.module.ts

import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { JobOfferModule } from 'src/job-offer/job-offer.module';

@Module({
  imports: [JobOfferModule],
  controllers: [DiscoveryController]
})
export class DiscoveryModule {}
