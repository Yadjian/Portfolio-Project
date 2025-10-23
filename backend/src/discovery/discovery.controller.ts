// src/discovery/discovery.controller.ts
import { Controller, Get, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {} // Injecter le service

  // === ENDPOINT CANDIDAT ===
  @Get('recruiters')
  @UseGuards(AuthGuard('jwt'))
  getRecruiterDiscoveryDeck(@Req() req: Request, @Query('radius', new DefaultValuePipe(30000), ParseIntPipe) radius: number,) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Pour l'instant, on appelle la méthode existante
    // Plus tard, on ajoutera le filtre des swipes ici
    return this.discoveryService.getRecruitersForCandidate(userId, radius);
  }
  
  // === ENDPOINT RECRUTEUR ===
  @Get('candidates')
  @UseGuards(AuthGuard('jwt'))
  getCandidateDiscoveryDeck(@Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    return this.discoveryService.getCandidatesForRecruiter(userId);
  }
}
