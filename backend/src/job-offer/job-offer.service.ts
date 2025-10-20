// Fichier: backend/src/job-offer/job-offer.service.ts

import { Prisma } from '@prisma/client';
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
        searchedCategories: true,
      },
    });

    if (!recruiterProfile) { 
      throw new NotFoundException('Profil recruteur introuvable.'); 
    }

    if (!recruiterProfile.memberships?.length) { 
      throw new ForbiddenException('Vous devez être associé à une entreprise.'); 
    }

    if (!recruiterProfile.searchedCategories?.length || !recruiterProfile.desiredContractTypes?.length || !recruiterProfile.desiredExperienceLevel) {
      throw new ForbiddenException("Veuillez finaliser votre profil (contrats, expérience, catégories) avant de poster une offre.");
    }

    const companyId = recruiterProfile.memberships[0].company.id;
    const categoryIds = recruiterProfile.searchedCategories.map(cat => ({ id: cat.id }));

    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto,
        contractType: recruiterProfile.desiredContractTypes[0], // Héritage du profil
        experienceLevel: recruiterProfile.desiredExperienceLevel, // Héritage du profil
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

  // 🚀 NOUVELLE VERSION OPTIMISÉE - BEAUCOUP PLUS SOLIDE !
  async findNearby(userId: string, radiusInMeters: number = 20000) {
    // 1. TROUVER LE PROFIL CANDIDAT
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }
    if (!candidateProfile.locationWKT) {
      throw new NotFoundException('La localisation du candidat est requise.');
    }
    const candidateId = candidateProfile.id;

    // 2. TROUVER LES OFFRES DÉJÀ SWIPÉES (Notre filtre)
    const swipedOffers = await this.prisma.swipe.findMany({
      where: {
        candidateId: candidateId,
        actorType: 'CANDIDATE',
      },
      select: { jobId: true },
    });
    const swipedJobIds = swipedOffers.map(swipe => swipe.jobId);

    // 3. TROUVER LES ID DES OFFRES À PROXIMITÉ (PostGIS optimisé)
    const nearbyJobResults = await this.prisma.$queryRaw<[{ id: string }]>`
      SELECT jo."id"
      FROM "JobOffer" jo
      WHERE jo."locationWKT" IS NOT NULL
      AND jo."isActive" = true
      AND ST_DWithin(
        ST_GeomFromText(jo."locationWKT", 4326),
        ST_GeomFromText(${candidateProfile.locationWKT}, 4326),
        ${radiusInMeters}
      )
    `;
    const nearbyJobIds = nearbyJobResults.map(job => job.id);

    // 4. RÉCUPÉRER LES DONNÉES COMPLÈTES POUR LE FRONT-END
    const jobOffersForDeck = await this.prisma.jobOffer.findMany({
      where: {
        // Doit être à proximité et ne doit pas avoir été swipée
        id: {
          in: nearbyJobIds,
          notIn: swipedJobIds,
        },
        isActive: true,
      },
      // ✅ DONNÉES COMPLÈTES POUR LE FRONTEND
      include: {
        company: true,    // Inclut toutes les infos de l'entreprise
        categories: true, // Inclut toutes les infos des catégories
        createdBy: true,  // Inclut TOUT le RecruiterProfile
      },
    });

    return jobOffersForDeck;
  }

  async update(id: string, userId: string, updateJobOfferDto: UpdateJobOfferDto) {
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { userId: true },
        },
      },
    });

    if (!jobOffer) {
      throw new NotFoundException('Offre d\'emploi introuvable.');
    }

    if (jobOffer.createdBy.userId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres offres.');
    }

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
    // 1. On cherche l'offre pour vérifier qu'elle existe et qui l'a créée
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

    // 2. Si l'offre n'existe pas, on renvoie une erreur "Non trouvé" (404)
    if (!jobOffer) {
      throw new NotFoundException(`Offre d'emploi avec l'ID "${id}" introuvable.`);
    }

    // 3. On vérifie que l'utilisateur qui demande la suppression est bien celui qui a créé l'offre
    if (jobOffer.createdBy.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette offre.');
    }

    // On supprime d'abord les swipes associés à cette offre pour éviter les erreurs de contrainte
    await this.prisma.swipe.deleteMany({
      where: { jobId: id },
    });

    // 4. Si tout est bon, on supprime l'offre de la base de données
    await this.prisma.jobOffer.delete({ where: { id } });
  }

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

  async updateOffersForRecruiter(recruiterProfileId: string, data: Prisma.JobOfferUpdateInput) {
    // Cette fonction met à jour TOUTES les offres d'un recruteur.
    // C'est la magie de la mise à jour en cascade.
    await this.prisma.jobOffer.updateMany({
      where: {
        createdById: recruiterProfileId,
      },
      data: {
        experienceLevel: data.experienceLevel,
        contractType: data.contractType,
        // On pourrait ajouter d'autres champs ici si nécessaire
      },
    });
  }
}