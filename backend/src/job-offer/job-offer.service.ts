// Fichier: backend/src/job-offer/job-offer.service.ts

// This service contains business logic for creating, retrieving, updating, and deleting job offers.

import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new job offer for a recruiter
  async create(createJobOfferDto: CreateJobOfferDto, userId: string) {
    // Find the recruiter's profile and related data
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        memberships: { include: { company: true } },
        searchedCategories: true,
      },
    });

    // If recruiter profile is not found, throw an error
    if (!recruiterProfile) { 
      throw new NotFoundException('Recruiter profile not found.'); 
    }

    // Recruiter must be associated with a company
    if (!recruiterProfile.memberships?.length) { 
      throw new ForbiddenException('You must be associated with a company.'); 
    }

    // Recruiter profile must be complete before posting a job offer
    if (!recruiterProfile.searchedCategories?.length || !recruiterProfile.desiredContractTypes?.length || !recruiterProfile.desiredExperienceLevel) {
      throw new ForbiddenException("Please complete your profile (contracts, experience, categories) before posting a job offer.");
    }

    // Get the company ID and category IDs from the recruiter's profile
    const companyId = recruiterProfile.memberships[0].company.id;
    const categoryIds = recruiterProfile.searchedCategories.map(cat => ({ id: cat.id }));

    // Create the job offer in the database
    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto,
        locationWKT: createJobOfferDto.locationWKT,
        contractType: recruiterProfile.desiredContractTypes[0], // Inherit from profile
        experienceLevel: recruiterProfile.desiredExperienceLevel, // Inherit from profile
        company: {
          connect: { id: companyId },
        },
        createdBy: {
          connect: { id: recruiterProfile.id },
        },
        categories: {
          connect: categoryIds,
        },
      },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        categories: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return jobOffer;
  }

  // Retrieve all active job offers, ordered by creation date (public endpoint)
  async findAll() {
    return this.prisma.jobOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        categories: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            memberships: {
              include: {
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Retrieve a single job offer by its ID (public endpoint)
  async findOne(id: string) {
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: true,
        categories: true,
        createdBy: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found.');
    }

    return jobOffer;
  }

  // Update a job offer (only the owner can update)
  async update(id: string, userId: string, updateJobOfferDto: UpdateJobOfferDto) {
    // Find the job offer and check ownership
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { userId: true },
        },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found.');
    }

    if (jobOffer.createdBy.userId !== userId) {
      throw new ForbiddenException('You can only update your own job offers.');
    }

    // Update the job offer with the provided data
    return this.prisma.jobOffer.update({
      where: { id },
      data: updateJobOfferDto,
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        categories: true,
      },
    });
  }

  // Delete a job offer (only the owner can delete)
  async remove(id: string, userId: string) {
    // 1. Find the job offer to verify existence and ownership
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      select: {
        createdBy: {
          select: {
            userId: true,
          },
        },
      },
    });

    // 2. If the job offer does not exist, throw a "Not Found" error (404)
    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID "${id}" not found.`);
    }

    // 3. Check that the user requesting deletion is the creator
    if (jobOffer.createdBy.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this job offer.');
    }

    // 4. If all checks pass, delete the job offer from the database
    await this.prisma.jobOffer.delete({ where: { id } });
  }

  // Retrieve all job offers created by a specific recruiter
  async findAllByRecruiter(userId: string) {
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Recruiter profile not found.');
    }

    return this.prisma.jobOffer.findMany({
      where: {
        createdById: recruiterProfile.id,
      },
      include: {
        company: true,
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update all job offers for a recruiter (cascade update)
  async updateOffersForRecruiter(recruiterProfileId: string, data: Prisma.JobOfferUpdateInput) {
    // This function updates ALL job offers for a recruiter.
    // Useful for cascading changes (e.g., when recruiter updates their profile).
    await this.prisma.jobOffer.updateMany({
      where: {
        createdById: recruiterProfileId,
      },
      data: {
        experienceLevel: data.experienceLevel,
        contractType: data.contractType,
        // Add other fields here if needed
      },
    });
  }
}
