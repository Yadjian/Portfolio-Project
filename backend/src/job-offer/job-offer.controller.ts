// Extrait de src/job-offers/job-offers.controller.ts

import { Controller, Post, Body, UseGuards, Req, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { AuthGuard } from '@nestjs/passport'; // Ou votre garde Auth0
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Protégez votre route
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Req() req) {
    // req.user sera le payload de votre token JWT, contenant l'ID de l'utilisateur
    const userId = req.user.sub; // Ou le chemin vers l'ID dans votre payload

    // Le service se chargera de trouver le RecruiterProfile associé à userId
    return this.jobOfferService.create(userId, createJobOfferDto);
  }
    // --- NOUVELLE MÉTHODE ---
  // GET /job-offers : Récupère la liste de toutes les offres
  @Get()
  findAll() {
    return this.jobOfferService.findAll();
  }

  // --- NOUVELLE MÉTHODE ---
  // GET /job-offers/:id : Récupère une offre par son ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { // ParseUUIDPipe valide que l'ID est bien un UUID
    return this.jobOfferService.findOne(id);
  }

  @Get('nearby')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('candidate')
  findNearby(@Req() req: Request, @Query('radius') radius?: string) {
    const auth0Id = req.user.sub;
    const radiusAsNumber = radius ? parseInt(radius, 10) : undefined;
    return this.jobOfferService.findNearby(auth0Id, radiusAsNumber);
  }
}
