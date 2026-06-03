// Fichier: backend/src/job-offer/job-offer.service.ts

import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException, ForbiddenException, BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobOfferDto: CreateJobOfferDto, userId: string) {
    // Validate user ID is provided
    if (!userId) {
      throw new BadRequestException('Utilisateur requis pour créer une offre.');
    }

    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        memberships: { include: { company: true } },
        searchedCategories: true,
      },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur introuvable.');
    }

    if (!recruiterProfile.memberships?.length) {
      throw new ForbiddenException('Vous devez être associé à une entreprise.');
    }

    if (
      !recruiterProfile.searchedCategories?.length ||
      !recruiterProfile.desiredContractTypes?.length ||
      !recruiterProfile.desiredExperienceLevel
    ) {
      throw new ForbiddenException(
        'Veuillez finaliser votre profil (contrats, expérience, catégories) avant de poster une offre.',
      );
    }

    // Extract company ID and category IDs for job offer creation
    const companyId = recruiterProfile.memberships[0].company.id;
    const categoryIds = recruiterProfile.searchedCategories.map((cat) => ({
      id: cat.id,
    }));

    // Create job offer with inherited recruiter preferences
    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto,
        locationWKT: createJobOfferDto.locationWKT,
        contractType: recruiterProfile.desiredContractTypes[0], // Inherited from recruiter profile
        experienceLevel: recruiterProfile.desiredExperienceLevel, // Inherited from recruiter profile
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
      // Include related data in response
      include: {
        company: { select: { name: true, logoUrl: true } },
        categories: true,
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    // Log job offer creation for audit trail
    console.log(`Job offer created: ${jobOffer.id} by user ${userId}`);

    return jobOffer;
  }

  async findAll() {
    // Retrieve all active job offers, sorted by creation date (newest first)
    return this.prisma.jobOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        // Include company information
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        // Include job categories
        categories: true,
        // Include recruiter information with their company associations
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

  async findOne(id: string) {
    // Retrieve a specific job offer by ID with related data
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

  async update(
    id: string,
    userId: string,
    updateJobOfferDto: UpdateJobOfferDto,
  ) {
    // Validate required parameters
    if (!id || !userId) {
      throw new BadRequestException('ID offre et utilisateur requis.');
    }

    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { userId: true },
        },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException("Offre d'emploi introuvable.");
    }

    // IDOR protection: Verify user is job offer creator or company member
    const isCreator = jobOffer.createdBy.userId === userId;

    // If not creator, check if user is a member of the company
    let isMemberOfCompany = false;
    if (!isCreator) {
      const membership = await this.prisma.recruiterMembership.findFirst({
        where: {
          companyId: jobOffer.companyId,
          recruiter: { userId: userId },
        },
      });
      isMemberOfCompany = !!membership;
    }

    if (!isCreator && !isMemberOfCompany) {
      console.warn(
        `IDOR blocked: User ${userId} tried to update job offer ${id}`,
      );
      throw new ForbiddenException(
        'Vous ne pouvez modifier que les offres de votre entreprise.',
      );
    }

    // Log authorization for audit trail
    console.log(
      `Job offer update authorized: ${id} by user ${userId} (creator: ${isCreator}, member: ${isMemberOfCompany})`,
    );

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

  async remove(id: string, userId: string) {
    // Validate required parameters
    if (!id || !userId) {
      throw new BadRequestException('ID offre et utilisateur requis.');
    }

    // Find job offer to verify existence and creator
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      select: {
        companyId: true,
        createdBy: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Check if job offer exists
    if (!jobOffer) {
      throw new NotFoundException(
        `Offre d'emploi avec l'ID "${id}" introuvable.`,
      );
    }

    // IDOR protection: Verify user is job offer creator or company member
    const isCreator = jobOffer.createdBy.userId === userId;

    // If not creator, check if user is a member of the company
    let isMemberOfCompany = false;
    if (!isCreator) {
      const membership = await this.prisma.recruiterMembership.findFirst({
        where: {
          companyId: jobOffer.companyId,
          recruiter: { userId: userId },
        },
      });
      isMemberOfCompany = !!membership;
    }

    if (!isCreator && !isMemberOfCompany) {
      console.warn(
        `IDOR deletion blocked: User ${userId} tried to delete job offer ${id}`,
      );
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer cette offre.",
      );
    }

    // Log authorization for audit trail
    console.log(
      `Job offer deletion authorized: ${id} by user ${userId} (creator: ${isCreator}, member: ${isMemberOfCompany})`,
    );

    // Delete job offer from database
    await this.prisma.jobOffer.delete({ where: { id } });
  }

  async findAllByRecruiter(userId: string) {
    // Validate user ID is provided
    if (!userId) {
      throw new BadRequestException('Utilisateur requis.');
    }

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

  async updateOffersForRecruiter(
    recruiterProfileId: string,
    data: Prisma.JobOfferUpdateInput,
  ) {
    // Update all job offers for a recruiter with cascading changes
    await this.prisma.jobOffer.updateMany({
      where: {
        createdById: recruiterProfileId,
      },
      data: {
        experienceLevel: data.experienceLevel,
        contractType: data.contractType,
        // Additional fields can be added here if needed
      },
    });
  }
}
