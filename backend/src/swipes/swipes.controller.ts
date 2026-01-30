// This controller handles endpoints related to swipe actions (like/dislike) between users.

import { Controller, Post, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SwipesService } from './swipes.service';

@Controller('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  // POST /swipes
  // Creates a new swipe (like/dislike) from the authenticated user.
  // Protected route: requires JWT authentication.
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createSwipe(@Req() req: Request, @Body() createSwipeDto: CreateSwipeDto) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Pass the user ID (from JWT) and the swipe DTO to the service
    return this.swipesService.handleSwipe(userId, createSwipeDto);
  }

  // DELETE /swipes/undo
  // Undoes the last swipe action for the authenticated user.
  // Protected route: requires JWT authentication.
  @Delete('undo')
  @UseGuards(AuthGuard('jwt'))
  undoSwipe(@Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service to undo the last swipe for this user
    return this.swipesService.undoLastSwipe(userId);
  }
}
