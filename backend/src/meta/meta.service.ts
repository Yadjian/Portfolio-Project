import { Injectable } from '@nestjs/common';
import { ContractType, ExperienceLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetaService {
  constructor(private readonly prisma: PrismaService) {}

  getRoles() {
    return [
      { value: 'candidate', label: 'Candidat' },
      { value: 'recruiter', label: 'Recruteur' },
      { value: 'admin', label: 'Administrateur' },
    ];
  }

  getContractTypes() {
    return Object.values(ContractType).map((value) => ({
      value,
      label: this.getContractTypeLabel(value),
    }));
  }

  getExperienceLevels() {
    return Object.values(ExperienceLevel).map((value) => ({
      value,
      label: this.getExperienceLevelLabel(value),
    }));
  }

  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

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

  private getExperienceLevelLabel(level: ExperienceLevel): string {
    const labels = {
      [ExperienceLevel.DEBUTANT]: 'Débutant',
      [ExperienceLevel.INTERMEDIAIRE]: 'Intermédiaire',
      [ExperienceLevel.CONFIRME]: 'Confirmé',
    };
    return labels[level] || level;
  }
}
