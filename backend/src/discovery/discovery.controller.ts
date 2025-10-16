// src/discovery/discovery.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JobOfferService } from '../job-offer/job-offer.service'; // Importer le service

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly jobOfferService: JobOfferService) {} // Injecter le service

  @Get('jobs')
  @UseGuards(AuthGuard('jwt'))
  getJobDiscoveryDeck(@Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Pour l'instant, on appelle la méthode existante
    // Plus tard, on ajoutera le filtre des swipes ici
    return this.jobOfferService.findNearby(userId);
  }
}
