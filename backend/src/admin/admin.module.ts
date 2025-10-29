// This file defines the AdminModule, which bundles all admin-related components and dependencies.

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // Import PrismaModule to enable database access in the admin module
  imports: [PrismaModule],
  // Register the admin controller to handle admin routes
  controllers: [AdminController],
  // Register the admin service to provide business logic for admin operations
  providers: [AdminService],
})
export class AdminModule {}
