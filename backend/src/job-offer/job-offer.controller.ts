// Fichier: backend/src/job-offers/job-offers.controller.ts

import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import type { Request } from 'express';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { AuthGuard } from '@nestjs/passport';
// import { Roles } from '../auth/roles/roles.decorator';
// import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // FIX: On passe les arguments dans le bon ordre (dto, puis userId)
    return this.jobOfferService.create(createJobOfferDto, userId);
  }

  @Get()
  findAll() {
    return this.jobOfferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobOfferService.findOne(id);
  }

  @Get('nearby')
  @UseGuards(AuthGuard('jwt'))
  findNearby(@Req() req: Request, @Query('radius') radius?: string) {
    const user = req.user as { sub: string };
    const userId = user.sub; // <-- FIX: Renommé pour la clarté
    const radiusAsNumber = radius ? parseInt(radius, 10) : undefined;
    return this.jobOfferService.findNearby(userId, radiusAsNumber); // <-- FIX: Passer userId
  }
}
