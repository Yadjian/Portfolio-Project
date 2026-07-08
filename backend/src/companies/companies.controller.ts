// This file defines the CompaniesController, which handles company-related endpoints.

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { CompaniesService } from './companies.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
