import { Module } from '@nestjs/common';
import { JobOffersController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobOffersController],
  providers: [JobOfferService]
})
export class JobOfferModule {}
