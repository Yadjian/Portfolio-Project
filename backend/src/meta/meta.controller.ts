import { Controller, Get } from '@nestjs/common';
import { MetaService } from './meta.service';

// This controller provides endpoints for retrieving metadata used throughout the application,
// such as user roles, contract types, experience levels, and job categories.
@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  // GET /meta/roles
  // Returns a list of all available user roles
  @Get('roles')
  getRoles() {
    return this.metaService.getRoles();
  }

  // GET /meta/contract-types
  // Returns a list of all available contract types
  @Get('contract-types')
  getContractTypes() {
    return this.metaService.getContractTypes();
  }

  // GET /meta/experience-levels
  // Returns a list of all available experience levels
  @Get('experience-levels')
  getExperienceLevels() {
    return this.metaService.getExperienceLevels();
  }

  // GET /meta/job-categories
  // Returns a list of all available job categories
  @Get('job-categories')
  getJobCategories() {
    return this.metaService.getJobCategories();
  }
}
