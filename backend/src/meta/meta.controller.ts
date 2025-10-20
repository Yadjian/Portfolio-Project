import { Controller, Get } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get('contract-types')
  getContractTypes() {
    return this.metaService.getContractTypes();
  }

  @Get('experience-levels')
  getExperienceLevels() {
    return this.metaService.getExperienceLevels();
  }

  @Get('job-categories')
  getJobCategories() {
    return this.metaService.getJobCategories();
  }
}
