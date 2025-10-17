// Fichier: backend/src/job-offer/job-offer.service.ts

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobOfferDto: CreateJobOfferDto, userId: string) {
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        memberships: { include: { company: true } },
        searchedCategories: true, // On inclut les catégories
      },
    });

    if (!recruiterProfile) { 
      throw new NotFoundException('Profil recruteur introuvable.'); 
    }

    if (!recruiterProfile.memberships?.length) { 
      throw new ForbiddenException('Vous devez être associé à une entreprise.'); 
    }

    if (!recruiterProfile.searchedCategories?.length || 
        !recruiterProfile.desiredContractTypes?.length || 
        !recruiterProfile.desiredExperienceLevel) {
      throw new ForbiddenException("Veuillez finaliser votre profil (contrats, expérience, catégories) avant de poster une offre.");
    }

    const companyId = recruiterProfile.memberships[0].company.id;
    const categoryIds = recruiterProfile.searchedCategories.map(cat => ({ id: cat.id }));

    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto, // title, description, locationWKT, salaryMin, salaryMax, etc.
        
        // ✅ RELATION AVEC L'ENTREPRISE
        company: {
          connect: { id: companyId },
        },
        
        // ✅ RELATION AVEC LE CRÉATEUR
        createdBy: {
          connect: { id: recruiterProfile.id },
        },

        // ✅ COPIE AUTOMATIQUE DES PRÉFÉRENCES DU RECRUTEUR
        contractType: recruiterProfile.desiredContractTypes[0], // Premier type de contrat par défaut
        experienceLevel: recruiterProfile.desiredExperienceLevel,
        
        // ✅ CONNEXION AUTOMATIQUE DES CATÉGORIES
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
        categories: true, // Inclure les catégories dans la réponse
      },
    });
  }

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

  async findNearby(userId: string, radiusInMeters: number = 20000) {
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
      return await this.prisma.$queryRaw`
        SELECT
          jo."id", jo."title", jo."contractType", jo."locationWKT", jo."experienceLevel",
          c."name" as "companyName",
          ST_Distance(
            ST_GeomFromText(jo."locationWKT", 4326),
            ST_GeomFromText(${candidateProfile.locationWKT}, 4326)
          ) as "distanceInMeters"
        FROM "JobOffer" jo
        JOIN "Company" c ON jo."companyId" = c."id"
        WHERE jo."locationWKT" IS NOT NULL
        AND jo."isActive" = true
        AND ST_DWithin(
          ST_GeomFromText(jo."locationWKT", 4326),
          ST_GeomFromText(${candidateProfile.locationWKT}, 4326),
          ${radiusInMeters}
        )
        ORDER BY "distanceInMeters" ASC;
      `;
    } catch (error) {
      throw new BadRequestException('Error processing geographic data');
    }
  }

  async update(jobOfferId: string, userId: string, dto: UpdateJobOfferDto) {
  // 1. Vérifier que l'utilisateur a le droit de modifier cette offre (la logique de ownership ne change pas)
  const recruiterProfile = await this.prisma.recruiterProfile.findUnique({ where: { userId } });
  const jobOffer = await this.prisma.jobOffer.findFirst({
    where: {
      id: jobOfferId,
      company: { members: { some: { recruiterId: recruiterProfile?.id } } },
    },
  });

  if (!jobOffer) {
    throw new ForbiddenException("Offre introuvable ou vous n'avez pas l'autorisation de la modifier.");
  }

  // 2. Mettre à jour l'offre avec les données simplifiées du DTO
  return this.prisma.jobOffer.update({
    where: { id: jobOfferId },
    data: dto, // On passe directement le DTO simplifié
  });
  }

  async remove(jobOfferId: string, userId: string) {
    // 1. Trouver le profil du recruteur qui fait la demande
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile) {
      throw new ForbiddenException("Profil recruteur introuvable.");
    }

    // 2. Trouver l'offre d'emploi et vérifier que le recruteur est bien membre de l'entreprise
    const jobOffer = await this.prisma.jobOffer.findFirst({
      where: {
        id: jobOfferId,
        company: {
          members: {
            some: {
              recruiterId: recruiterProfile.id,
            },
          },
        },
      },
    });

    // Si l'offre n'est pas trouvée ou que l'utilisateur n'a pas les droits, on rejette
    if (!jobOffer) {
      throw new ForbiddenException("Offre introuvable ou vous n'avez pas l'autorisation de la supprimer.");
    }

    // 3. Si tout est bon, supprimer l'offre
    await this.prisma.jobOffer.delete({
      where: { id: jobOfferId },
    });

    // On peut ne rien retourner, car le contrôleur enverra un statut 204 No Content
  }
}
