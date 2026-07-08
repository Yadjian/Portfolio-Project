import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a company and associates it with an existing recruiter.
   * This is the onboarding step following a recruiter's signup.
   * @param dto Information about the company (name, SIRET)
   * @param userId The ID of the user (recruiter) performing the action
   */
  async createCompanyForRecruiter(
    dto: CreateCompanyOnboardingDto,
    userId: string,
  ) {
    // Secure input validation
    if (!userId) {
      throw new BadRequestException(
        'Utilisateur requis pour créer une entreprise.',
      );
    }

    if (!dto.companyName?.trim() || !dto.siret?.trim()) {
      throw new BadRequestException("Nom d'entreprise et SIRET requis.");
    }

    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: { memberships: true }, 
    });

    if (!recruiterProfile) {
      throw new NotFoundException(
        'Profil recruteur introuvable pour cet utilisateur.',
      );
    }

    if (recruiterProfile.memberships.length > 0) {
      throw new ConflictException(
        'Ce recruteur est déjà associé à une entreprise.',
      );
    }

    const existingCompany = await this.prisma.company.findUnique({
      where: { siret: dto.siret },
    });

    if (existingCompany) {
      throw new ConflictException(
        'Une entreprise avec ce numéro SIRET existe déjà.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          siret: dto.siret,
        },
      });

      const membership = await tx.recruiterMembership.create({
        data: {
          recruiterId: recruiterProfile.id,
          companyId: company.id,
          isPrimary: true,
          internalRole: 'Admin',
        },
      });

      console.log(
        `Company created: ${company.id} (${company.name}) by user ${userId}`,
      );
      console.log(
        `Membership created: ${membership.id} for recruiter ${recruiterProfile.id}`,
      );

      return { company, membership };
    });
  }
}
