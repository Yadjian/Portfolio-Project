// This file defines the CompaniesService, which contains business logic for company operations.

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new company and associates it with an existing recruiter.
   * This is the onboarding step that follows recruiter registration.
   * @param dto Company information (name, SIRET)
   * @param userId The ID of the user (recruiter) performing the action
   */
  async createCompanyForRecruiter(dto: CreateCompanyOnboardingDto, userId: string) {
    // 1. Find the recruiter profile for the requesting user
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: { memberships: true }, // Include current memberships
    });

    // Throw error if the user does not have a recruiter profile
    if (!recruiterProfile) {
      throw new NotFoundException('Recruiter profile not found for this user.');
    }

    // Throw error if the recruiter is already a member of a company
    if (recruiterProfile.memberships.length > 0) {
      throw new ConflictException('This recruiter is already associated with a company.');
    }

    // 2. Check if a company with the same SIRET already exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { siret: dto.siret },
    });

    if (existingCompany) {
      throw new ConflictException('A company with this SIRET number already exists.');
    }

    // 3. Use a transaction to create the company and the membership atomically
    return this.prisma.$transaction(async (tx) => {
      // Create the new company
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          siret: dto.siret,
        },
      });

      // Create the membership to link the recruiter to the new company
      const membership = await tx.recruiterMembership.create({
        data: {
          recruiterId: recruiterProfile.id,
          companyId: company.id,
          isPrimary: true, // The creator is the main admin
          internalRole: 'Admin', // Default role
        },
      });

      // Return the created company and membership
      return { company, membership };
    });
  }
}
