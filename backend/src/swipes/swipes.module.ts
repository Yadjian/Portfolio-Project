// This module bundles all swipe-related components and dependencies for handling swipe actions between users.

import { Module } from '@nestjs/common';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import PrismaModule for database access
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule for authentication and AuthGuard
import { NotificationsModule } from 'src/notifications/notifications.module'; // Import NotificationsModule for sending notifications

@Module({
  // Import required modules to enable database access, authentication, and notifications
  imports: [PrismaModule, AuthModule, NotificationsModule],
  // Register the SwipesController to handle swipe-related routes
  controllers: [SwipesController],
  // Register the SwipesService to provide business logic for swipe actions
  providers: [SwipesService],
})
export class SwipesModule {}
