// This file defines the CompaniesModule, which bundles all company-related components and dependencies.

import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // Import PrismaModule to enable database access for company operations
  imports: [PrismaModule],
  // Register the CompaniesController to handle company-related routes
  controllers: [CompaniesController],
  // Register the CompaniesService to provide business logic for companies
  providers: [CompaniesService],
})
export class CompaniesModule {}
