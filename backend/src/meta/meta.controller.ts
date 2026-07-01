import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MetaService } from './meta.service';

@Controller('meta')
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 req/min endpoints publics
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get('roles')
  getRoles() {
    return this.metaService.getRoles();
  }

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
