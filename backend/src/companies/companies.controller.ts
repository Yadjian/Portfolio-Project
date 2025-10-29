// This file defines the CompaniesController, which handles company-related endpoints.

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
// import { Roles } from '../auth/roles/roles.decorator'; // Optionally use for role-based access
// import { RolesGuard } from '../auth/roles/roles.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // POST /companies/onboarding
  // Protected route: only accessible to authenticated users (JWT required)
  // Handles onboarding a new company for a recruiter
  @Post('onboarding')
  @UseGuards(AuthGuard('jwt')) // Protect the route with JWT authentication
  createCompanyOnboarding(
    @Req() req: Request,
    @Body() dto: CreateCompanyOnboardingDto,
  ) {
    // Extract the user ID from the JWT token payload
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Call the service method to create a company for the recruiter
    return this.companiesService.createCompanyForRecruiter(dto, userId);
  }
}
