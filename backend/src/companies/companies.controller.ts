// Fichier: backend/src/companies/companies.controller.ts

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
// import { Roles } from '../auth/roles/roles.decorator'; <-- Optionnel pour l'instant
// import { RolesGuard } from '../auth/roles/roles.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('onboarding')
  @UseGuards(AuthGuard('jwt')) // Protéger la route, c'est suffisant pour le moment
  createCompanyOnboarding(
    @Req() req: Request,
    @Body() dto: CreateCompanyOnboardingDto,
  ) {
    // FIX: On récupère l'ID de l'utilisateur depuis le token
    const user = req.user as { sub: string };
    const userId = user.sub;

    // FIX: On appelle la nouvelle méthode du service avec les bons arguments
    return this.companiesService.createCompanyForRecruiter(dto, userId);
  }
}
