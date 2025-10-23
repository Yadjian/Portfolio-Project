import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';


@Module({
  imports: [PrismaModule, FileStorageModule,],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
