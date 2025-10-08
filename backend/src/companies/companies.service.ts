// Fichier: backend/src/companies/companies.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyOnboardingDto } from './dto/create-company-onboarding.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompanyAndProfile(auth0Id: string, dto: CreateCompanyOnboardingDto) {
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: { recruiterProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.recruiterProfile) {
      throw new ConflictException('Recruiter profile already exists for this user.');
    }

    // On exécute toutes les créations dans une seule transaction
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          siret: dto.siret,
        },
      });

      // On crée le profil recruteur avec des valeurs par défaut
      const recruiterProfile = await tx.recruiterProfile.create({
        data: {
          firstName: "Prénom", // <-- VALEUR PAR DÉFAUT
          lastName: "Nom",     // <-- VALEUR PAR DÉFAUT
          user: { connect: { id: user.id } },
        },
      });

      await tx.recruiterMembership.create({
        data: {
          isPrimary: true,
          internalRole: 'Admin',
          recruiter: { connect: { id: recruiterProfile.id } },
          company: { connect: { id: company.id } },
        },
      });

      return recruiterProfile;
    });
  }
}