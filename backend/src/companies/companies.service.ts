// Fichier: backend/src/companies/companies.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// Assurez-vous que le nom du DTO correspond à ce que vous avez créé
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une entreprise et y associe un recruteur existant.
   * C'est l'étape d'onboarding qui suit l'inscription d'un recruteur.
   * @param dto Les informations sur l'entreprise (nom, SIRET)
   * @param userId L'ID de l'utilisateur (recruteur) qui effectue l'action
   */
  async createCompanyForRecruiter(
    dto: CreateCompanyOnboardingDto,
    userId: string,
  ) {
    // 🔒 Validation sécurisée des entrées
    if (!userId) {
      throw new BadRequestException(
        'Utilisateur requis pour créer une entreprise.',
      );
    }

    if (!dto.companyName?.trim() || !dto.siret?.trim()) {
      throw new BadRequestException("Nom d'entreprise et SIRET requis.");
    }

    // 1. Trouver le profil du recruteur qui fait la demande
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: { memberships: true }, // On inclut ses adhésions actuelles
    });

    // Erreur si l'utilisateur n'a pas de profil recruteur
    if (!recruiterProfile) {
      throw new NotFoundException(
        'Profil recruteur introuvable pour cet utilisateur.',
      );
    }

    // Erreur si le recruteur est déjà membre d'une entreprise
    if (recruiterProfile.memberships.length > 0) {
      throw new ConflictException(
        'Ce recruteur est déjà associé à une entreprise.',
      );
    }

    // 2. Vérifier que l'entreprise n'existe pas déjà avec ce SIRET
    const existingCompany = await this.prisma.company.findUnique({
      where: { siret: dto.siret },
    });

    if (existingCompany) {
      throw new ConflictException(
        'Une entreprise avec ce numéro SIRET existe déjà.',
      );
    }

    // 3. Utiliser une transaction pour créer l'entreprise ET l'adhésion
    return this.prisma.$transaction(async (tx) => {
      // Créer la nouvelle entreprise
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          siret: dto.siret,
        },
      });

      // Créer l'adhésion pour lier le recruteur à cette nouvelle entreprise
      const membership = await tx.recruiterMembership.create({
        data: {
          recruiterId: recruiterProfile.id,
          companyId: company.id,
          isPrimary: true, // Le créateur est l'admin principal
          internalRole: 'Admin', // Rôle par défaut
        },
      });

      // 🔒 Log sécurisé de création d'entreprise
      console.log(
        `✅ Company created: ${company.id} (${company.name}) by user ${userId}`,
      );
      console.log(
        `✅ Membership created: ${membership.id} for recruiter ${recruiterProfile.id}`,
      );

      // On retourne l'entreprise et l'adhésion créées
      return { company, membership };
    });
  }
}
