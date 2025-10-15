// Fichier: backend/src/job-offer/job-offer.service.ts

import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(auth0Id: string, createJobOfferDto: CreateJobOfferDto) {
    // 1. Trouver le profil du recruteur qui fait la requête
    const recruiterProfile = await this.prisma.recruiterProfile.findFirst({
      where: { user: { auth0Id } },
            include: {
        // On inclut les adhésions (memberships) pour trouver la compagnie
        memberships: {
          include: {
            company: true, // Et on inclut les données de la compagnie liée
          },
        },
      },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Recruiter profile not found for this user.');
    }

    // On suppose qu'un recruteur est lié à une seule compagnie lors de sa création.
    // Si la liste des memberships est vide ou que la compagnie n'existe pas, on lève une erreur.
    if (!recruiterProfile.memberships || recruiterProfile.memberships.length === 0) {
      throw new ForbiddenException('You are not associated with any company and cannot post a job offer.');
    }

    // 3. Extraire les informations nécessaires
    const companyId = recruiterProfile.memberships[0].company.id;
    const recruiterId = recruiterProfile.id;

    // 3. Si tout est bon, créer l'offre d'emploi
    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        title: createJobOfferDto.title,
        description: createJobOfferDto.description,
        contractType: createJobOfferDto.contractType,
        locationWKT: createJobOfferDto.locationWKT,
        salaryMin: createJobOfferDto.salaryMin,
        salaryMax: createJobOfferDto.salaryMax,
        // On lie l'offre à l'entreprise ET au recruteur qui l'a créée
        companyId: companyId,
        createdById: recruiterId,
      },
    });

    return jobOffer;
  }

  // --- NOUVELLE MÉTHODE ---
  async findAll() {
    return this.prisma.jobOffer.findMany({
      where: { isActive: true }, // On ne récupère que les offres actives
      orderBy: { createdAt: 'desc' }, // On trie par date de création, la plus récente d'abord
      include: {
        company: { // Inclut les informations de l'entreprise
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });
  }

  // --- NOUVELLE MÉTHODE ---
  async findOne(id: string) {
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: true, // Inclut l'objet Company complet
        createdBy: {   // Inclut le profil du recruteur qui a créé l'offre
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found.');
    }

    return jobOffer;
  }

  async findNearby(auth0Id: string, radiusInMeters: number = 20000) {
    const candidateProfile = await this.prisma.candidateProfile.findFirst({
      where: { user: { auth0Id } },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Candidate profile not found.');
    }

    if (!candidateProfile.locationWKT) {
      throw new NotFoundException('Candidate location must be set before searching for nearby jobs.');
    }

    // ✅ AJOUT: Gestion des erreurs de conversion
    try {
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
