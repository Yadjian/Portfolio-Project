import { PartialType } from '@nestjs/swagger';
import { CreateJobOfferDto } from './create-job-offer.dto';

// Cette classe hérite de toutes les propriétés de CreateJobOfferDto
// mais les rend toutes optionnelles. C'est la méthode standard pour les DTO de mise à jour.
export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}
