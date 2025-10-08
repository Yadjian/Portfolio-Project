// Fichier: backend/src/companies/companies.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('onboarding') // Route : POST /companies/onboarding
  @UseGuards(AuthGuard('jwt'), RolesGuard) // On chaîne les gardes : d'abord authentification, puis autorisation
  @Roles('recruiter') // Seuls les utilisateurs avec le rôle 'recruiter' peuvent accéder
  createCompanyAndProfile(
    @Req() req: Request,
    @Body() dto: CreateCompanyOnboardingDto,
  ) {
    const auth0Id = req.user.sub;
    return this.companiesService.createCompanyAndProfile(auth0Id, dto);
  }
}
