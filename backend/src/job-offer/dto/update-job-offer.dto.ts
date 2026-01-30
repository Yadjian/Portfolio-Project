import { PartialType } from '@nestjs/swagger';
import { CreateJobOfferDto } from './create-job-offer.dto';

// This class inherits all properties from CreateJobOfferDto
// but makes them all optional. This is the standard approach for update DTOs in NestJS.
// It allows partial updates of job offers, so only the fields to be changed need to be provided.
export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}
