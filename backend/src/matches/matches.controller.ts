// src/matches/matches.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllMatches(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.matchesService.findAllMatches(user.sub);
  }

  @Get(':id') // Ex: /matches/uuid-du-swipe
  @UseGuards(AuthGuard('jwt'))
  getMatchDetails(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) swipeId: string,
  ) {
    const user = req.user as { sub: string };
    return this.matchesService.getMatchDetails(user.sub, swipeId);
  }
}
