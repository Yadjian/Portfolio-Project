// This file defines the DiscoveryController, which handles endpoints related to user discovery features.

import { Controller, Get, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {} // Inject the DiscoveryService

  // === CANDIDATE ENDPOINT ===
  // GET /discovery/recruiters
  // Returns a list of recruiters for the candidate to discover.
  // Protected route: requires JWT authentication.
  // Accepts an optional 'radius' query parameter (default: 20000).
  @Get('recruiters')
  @UseGuards(AuthGuard('jwt'))
  getRecruiterDiscoveryDeck(
    @Req() req: Request,
    @Query('radius', new DefaultValuePipe(20000), ParseIntPipe) radius: number,
  ) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service to get recruiters for the candidate
    // (Swipe filtering can be added here in the future)
    return this.discoveryService.getRecruitersForCandidate(userId, radius);
  }
  
  // === RECRUITER ENDPOINT ===
  // GET /discovery/candidates
  // Returns a list of candidates for the recruiter to discover.
  // Protected route: requires JWT authentication.
  // Accepts an optional 'radius' query parameter (default: 20000).
  @Get('candidates')
  @UseGuards(AuthGuard('jwt'))
  getCandidateDiscoveryDeck(
    @Req() req: Request,
    @Query('radius', new DefaultValuePipe(20000), ParseIntPipe) radius: number,
  ) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service to get candidates for the recruiter
    return this.discoveryService.getCandidatesForRecruiter(userId, radius);
  }
  
  // === RECRUITER NOTIFICATIONS ENDPOINT ===
  // GET /discovery/pending-candidates
  // Returns a list of candidates who are pending for the recruiter (e.g., waiting for a response).
  // Protected route: requires JWT authentication.
  @Get('pending-candidates')
  @UseGuards(AuthGuard('jwt'))
  getPendingCandidates(@Req() req: Request) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service to get pending candidates for the recruiter
    return this.discoveryService.getPendingCandidatesForRecruiter(userId);
  }
}
