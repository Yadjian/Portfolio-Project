import { Injectable } from '@nestjs/common';
import { ContractType, ExperienceLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetaService {
  constructor(private readonly prisma: PrismaService) {}

  getContractTypes() {
    return Object.values(ContractType);
  }

  getExperienceLevels() {
    return Object.values(ExperienceLevel);
  }

  async getJobCategories() {
    return this.prisma.jobCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
