import { Module } from '@nestjs/common';
import { JobOffersController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JobOffersController],
  providers: [JobOfferService]
})
export class JobOfferModule {}
