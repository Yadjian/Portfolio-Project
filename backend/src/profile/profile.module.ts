import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';

@Module({
  // Import PrismaModule for database access and FileStorageModule for file upload features
  imports: [PrismaModule, FileStorageModule],
  // Register the ProfileController to handle profile-related routes
  controllers: [ProfileController],
  // Register the ProfileService to provide business logic for profile management
  providers: [ProfileService],
})
export class ProfileModule {}
