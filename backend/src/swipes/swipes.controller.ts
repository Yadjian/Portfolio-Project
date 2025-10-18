// src/swipes/swipes.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SwipesService } from './swipes.service';

@Controller('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createSwipe(@Req() req: Request, @Body() createSwipeDto: CreateSwipeDto) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // On passe l'ID de l'utilisateur (du JWT) et le DTO au service
    return this.swipesService.createSwipe(userId, createSwipeDto);
  }
}
