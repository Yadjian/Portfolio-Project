// This file defines the JobOffersController, which handles endpoints related to job offer management.

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';


@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  // POST /job-offers
  // Creates a new job offer. Protected route: requires JWT authentication.
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;

    // Pass the DTO and userId to the service for job offer creation
    return this.jobOfferService.create(createJobOfferDto, userId);
  }

  // GET /job-offers
  // Returns all job offers (public endpoint)
  @Get()
  findAll() {
    return this.jobOfferService.findAll();
  }

  // GET /job-offers/my-offers
  // Returns all job offers created by the authenticated recruiter
  @Get('my-offers')
  @UseGuards(AuthGuard('jwt'))
  findMyOffers(@Req() req: Request) {
    const user = req.user as { sub: string };
    const userId = user.sub;
    return this.jobOfferService.findAllByRecruiter(userId);
  }

  // GET /job-offers/:id
  // Returns a specific job offer by its ID (public endpoint)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobOfferService.findOne(id);
  }

  // PUT /job-offers/:id
  // Updates a job offer. Protected route: only the owner can update.
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
  ) {
    const user = req.user as { sub: string };
    return this.jobOfferService.update(id, user.sub, updateJobOfferDto);
  }

  // DELETE /job-offers/:id
  // Deletes a job offer. Protected route: only the owner can delete.
  // Returns HTTP 204 No Content on success.
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT) // A successful DELETE returns status 204
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as { sub: string };
    return this.jobOfferService.remove(id, user.sub);
  }
}
