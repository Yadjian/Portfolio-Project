// Fichier: backend/src/job-offer/job-offer.service.ts

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobOfferDto: CreateJobOfferDto, userId: string) {
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      // ✅ AJOUT : On inclut les adhésions ET les catégories d'intérêt du recruteur
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
        searchedCategories: true, // Assurez-vous que la relation est bien nommée 'searchedCategories' dans votre schema.prisma
      },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Recruiter profile not found for this user.');
    }

    if (!recruiterProfile.memberships || recruiterProfile.memberships.length === 0) {
      throw new ForbiddenException('You are not associated with any company and cannot post a job offer.');
    }

    // ✅ AJOUT : On vérifie que le recruteur a bien défini ses catégories
    if (!recruiterProfile.searchedCategories || recruiterProfile.searchedCategories.length === 0) {
      throw new ForbiddenException("Veuillez finaliser votre profil en définissant vos catégories d'intérêt avant de poster une offre.");
    }

    const companyId = recruiterProfile.memberships[0].company.id;
    // Note: Vous devrez peut-être ajouter une colonne 'createdById' à votre modèle JobOffer
    // pour stocker l'ID du recruteur qui a créé l'offre.
    // const recruiterId = recruiterProfile.id;

    // On extrait les IDs des catégories du profil du recruteur
    const categoryIds = recruiterProfile.searchedCategories.map(category => ({ id: category.id }));

    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        title: createJobOfferDto.title,
        description: createJobOfferDto.description,
        contractType: createJobOfferDto.contractType,
        locationWKT: createJobOfferDto.locationWKT,
        salaryMin: createJobOfferDto.salaryMin,
        salaryMax: createJobOfferDto.salaryMax,
        // Connect the creator (required by the Prisma type) to the recruiter profile
        createdBy: {
          connect: { id: recruiterProfile.id },
        },
        // On connecte l'entreprise via la relation plutôt que d'utiliser companyId directement
        company: {
          connect: { id: companyId },
        },
        // ✅ MODIFICATION : On connecte automatiquement les catégories du profil
        categories: {
          connect: categoryIds,
        },
      },
    });

    return jobOffer;
  }

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
      },
    });
  }

  async findOne(id: string) {
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: true,
        // createdBy: { ... } // Si vous avez la relation 'createdBy'
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found.');
    }

    return jobOffer;
  }

  // --- VERSION CORRIGÉE ---
  async findNearby(userId: string, radiusInMeters: number = 20000) {
    // FIX: On cherche le profil candidat directement via son userId, qui est unique
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Candidate profile not found.');
    }

    if (!candidateProfile.locationWKT) {
      throw new NotFoundException('Candidate location must be set before searching for nearby jobs.');
    }

    try {
      // Le reste de votre requête SQL est parfait et n'a pas besoin de changer.
      return await this.prisma.$queryRaw`
        SELECT
          "id", "title", "contractType", "locationWKT",
          ST_Distance(
            ST_GeomFromText("locationWKT", 4326),
            ST_GeomFromText(${candidateProfile.locationWKT}, 4326)
          ) as "distanceInMeters"
        FROM "JobOffer"
        WHERE "locationWKT" IS NOT NULL
        AND "isActive" = true
        AND ST_DWithin(
          ST_GeomFromText("locationWKT", 4326),
          ST_GeomFromText(${candidateProfile.locationWKT}, 4326),
          ${radiusInMeters}
        )
        ORDER BY "distanceInMeters" ASC;
      `;
    } catch (error) {
      throw new BadRequestException('Error processing geographic data');
    }
  }
}
