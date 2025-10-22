import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GeocodingModule } from '../geocoding/geocoding.module';



@Module({
  imports: [PrismaModule,GeocodingModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
