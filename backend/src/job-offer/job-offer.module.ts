import { Module } from '@nestjs/common';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';

@Module({
  controllers: [JobOfferController],
  providers: [JobOfferService]
})
export class JobOfferModule {}
