// This file defines the DiscoveryController, which handles endpoints related to user discovery features.

import {
  Controller,
  Get,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {} // Inject the DiscoveryService

  // === CANDIDATE ENDPOINT ===
  // GET /discovery/recruiters
  // Returns a list of recruiters for the candidate to discover.
  // Protected route: requires JWT authentication.
  // Accepts optional 'radius', 'latitude', and 'longitude' query parameters.
  @Get('recruiters')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
  getRecruiterDiscoveryDeck(
    @Req() req: Request,
    @Query('radius', new DefaultValuePipe(20000), ParseIntPipe) radius: number,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Parse coordinates if provided
    const coords =
      latitude && longitude
        ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }
        : undefined;

    // Call the service to get recruiters for the candidate
    return this.discoveryService.getRecruitersForCandidate(
      userId,
      radius,
      coords,
    );
  }

  // === RECRUITER ENDPOINT ===
  // GET /discovery/candidates
  // Returns a list of candidates for the recruiter to discover.
  // Protected route: requires JWT authentication.
  // Accepts optional 'radius', 'latitude', and 'longitude' query parameters.
  @Get('candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER')
  getCandidateDiscoveryDeck(
    @Req() req: Request,
    @Query('radius', new DefaultValuePipe(20000), ParseIntPipe) radius: number,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Parse coordinates if provided
    const coords =
      latitude && longitude
        ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }
        : undefined;

    // Call the service to get candidates for the recruiter
    return this.discoveryService.getCandidatesForRecruiter(
      userId,
      radius,
      coords,
    );
  }

  // === RECRUITER NOTIFICATIONS ENDPOINT ===
  // GET /discovery/pending-candidates
  // Returns a list of candidates who are pending for the recruiter (e.g., waiting for a response).
  // Protected route: requires JWT authentication.
  @Get('pending-candidates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER')
  getPendingCandidates(@Req() req: Request) {
    // Extract user ID from JWT payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service to get pending candidates for the recruiter
    return this.discoveryService.getPendingCandidatesForRecruiter(userId);
  }
}
