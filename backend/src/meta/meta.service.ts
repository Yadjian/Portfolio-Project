import { Injectable } from '@nestjs/common';
import { ContractType, ExperienceLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
// This service provides metadata used throughout the application,
// such as user roles, contract types, experience levels, and job categories.
export class MetaService {
  constructor(private readonly prisma: PrismaService) {}

  // Returns a list of all available user roles with their labels
  getRoles() {
    return [
      { value: 'candidate', label: 'Candidat' },
      { value: 'recruiter', label: 'Recruteur' },
      { value: 'admin', label: 'Administrateur' },
    ];
  }

  // Returns a list of all contract types with their labels
  getContractTypes() {
    return Object.values(ContractType).map(value => ({
      value,
      label: this.getContractTypeLabel(value),
    }));
  }

  // Returns a list of all experience levels with their labels
  getExperienceLevels() {
    return Object.values(ExperienceLevel).map(value => ({
      value,
      label: this.getExperienceLevelLabel(value),
    }));
  }

  // Retrieves all job categories from the database, ordered alphabetically by name
  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Helper: Maps contract type enum values to user-friendly labels
  private getContractTypeLabel(type: ContractType): string {
    const labels = {
      [ContractType.CDI]: 'CDI',
      [ContractType.CDD]: 'CDD',
      [ContractType.ALTERNANCE]: 'Alternance',
      [ContractType.STAGE]: 'Stage',
      [ContractType.FREELANCE]: 'Freelance',
      [ContractType.AUTRE]: 'Autre',
    };
    return labels[type] || type;
  }

  // Helper: Maps experience level enum values to user-friendly labels
  private getExperienceLevelLabel(level: ExperienceLevel): string {
    const labels = {
      [ExperienceLevel.DEBUTANT]: 'Débutant',
      [ExperienceLevel.INTERMEDIAIRE]: 'Intermédiaire',
      [ExperienceLevel.CONFIRME]: 'Confirmé',
    };
    return labels[level] || level;
  }
}
