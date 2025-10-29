// Fichier: backend/src/profile/profile.controller.ts

// This controller handles all endpoints related to user profile management (view, update, upload photo/resume, etc.)

import { Controller, Get, Put, Post, Delete, UseGuards, Req, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile') // All routes in this controller will start with /profile
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /profile/me
  // Returns the authenticated user's profile
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Protects the route with JWT authentication
  getProfile(@Req() req: Request) {
    // req.user is the JWT payload, attached by the AuthGuard
    const userId = req.user.sub;
    // Pass the user ID to the service to retrieve profile data
    return this.profileService.getUserProfile(userId);
  }

  // PUT /profile/me
  // Updates the authenticated user's profile (including optional photo upload)
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photoFile'))
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // Photo upload is optional
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // Max 2 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/i }), // Only JPG or PNG
        ],
      }),
    ) photoFile?: Express.Multer.File,
  ) {
    const userId = req.user.sub;
    // Pass the user ID, new data, and file (if present) to the service
    return this.profileService.updateProfile(userId, updateProfileDto, photoFile);
  }

  // PUT /profile/location
  // Updates the user's location (WKT and name)
  @Put('location')
  @UseGuards(AuthGuard('jwt'))
  updateLocation(@Req() req: Request, @Body() updateLocationDto: UpdateLocationDto) {
    const userId = req.user.sub;
    return this.profileService.updateUserLocation(userId, updateLocationDto);
  }

  // GET /profile/categories
  // Returns all available job categories
  @Get('categories')
  async getJobCategories() {
    return this.profileService.getJobCategories();
  }

  // PUT /profile/photo
  // Uploads or updates the user's profile photo
  @Put('photo')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photoFile'))
  uploadProfilePhoto(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // Max 2 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/i }), // Only JPG or PNG
        ],
      }),
    ) photoFile: Express.Multer.File,
  ) {
    const userId = req.user.sub;
    return this.profileService.updateProfilePhoto(userId, photoFile);
  }

  // PUT /profile/resume
  // Uploads or updates the user's resume (PDF only)
  @Put('resume')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('resumeFile')) // 'resumeFile' is the field name
  uploadResume(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // Max 5 MB
          new FileTypeValidator({ fileType: 'application/pdf' }), // Only PDF files
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    const user = req.user as { sub: string };
    // Pass the file and user ID to the service
    return this.profileService.updateResume(user.sub, file);
  }

  // DELETE /profile/resume
  // Deletes the user's resume
  @Delete('resume')
  @UseGuards(AuthGuard('jwt'))
  deleteResume(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.profileService.deleteResume(user.sub);
  }

  // POST /profile/push-token
  // Updates the user's push notification token
  @Post('push-token')
  @UseGuards(AuthGuard('jwt'))
  updatePushToken(@Req() req: Request, @Body('token') token: string) {
    const userId = req.user.sub;
    return this.profileService.updatePushToken(userId, token);
  }
}
