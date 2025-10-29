// This controller handles endpoints related to user matches (e.g., candidate-recruiter matches).

import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // GET /matches
  // Returns all matches for the authenticated user.
  // Protected route: requires JWT authentication.
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllMatches(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.matchesService.findAllMatches(user.sub);
  }

  // GET /matches/:id
  // Returns details for a specific match (by swipe ID) for the authenticated user.
  // Protected route: requires JWT authentication.
  @Get(':id') // Example: /matches/uuid-of-swipe
  @UseGuards(AuthGuard('jwt'))
  getMatchDetails(@Req() req: Request, @Param('id') swipeId: string) {
    const user = req.user as { sub: string };
    return this.matchesService.getMatchDetails(user.sub, swipeId);
  }
}
