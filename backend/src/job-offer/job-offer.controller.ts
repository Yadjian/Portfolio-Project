// Extrait de src/job-offers/job-offers.controller.ts

import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { AuthGuard } from '@nestjs/passport'; // Ou votre garde Auth0

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOfferService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Protégez votre route
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Req() req) {
    // req.user sera le payload de votre token JWT, contenant l'ID de l'utilisateur
    const userId = req.user.sub; // Ou le chemin vers l'ID dans votre payload

    // Le service se chargera de trouver le RecruiterProfile associé à userId
    return this.jobOffersService.create(userId, createJobOfferDto);
  }
    // --- NOUVELLE MÉTHODE ---
  // GET /job-offers : Récupère la liste de toutes les offres
  @Get()
  findAll() {
    return this.jobOffersService.findAll();
  }

  // --- NOUVELLE MÉTHODE ---
  // GET /job-offers/:id : Récupère une offre par son ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { // ParseUUIDPipe valide que l'ID est bien un UUID
    return this.jobOffersService.findOne(id);
  }
}
