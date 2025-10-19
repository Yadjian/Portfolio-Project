// Fichier: backend/src/profile/profile.controller.ts

import { Controller, Get, Put, Delete, UseGuards, Req, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile') // Toutes les routes de ce contrôleur commenceront par /profile
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me') // Définit la route GET /profile/me
  @UseGuards(AuthGuard('jwt')) // Protège la route avec notre stratégie JWT
  getProfile(@Req() req: Request) {
    // req.user est le payload du token, attaché par le AuthGuard
    const userId = req.user.sub;
    
    // On passe l'ID de l'utilisateur au service pour qu'il récupère les données
    return this.profileService.getUserProfile(userId);
  }

  @Put('me') // Définit la route PUT /profile/me
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.sub;
    
    // On passe l'ID et les nouvelles données au service
    return this.profileService.updateUserProfile(userId, updateProfileDto);
  }
  @Put('location') // Crée la route POST /profile/location
  @UseGuards(AuthGuard('jwt'))
  updateLocation(@Req() req: Request, @Body() updateLocationDto: UpdateLocationDto) {
    const userId = req.user.sub;
    return this.profileService.updateUserLocation(userId, updateLocationDto);
  }

  @Get('categories')
  async getJobCategories() {
    return this.profileService.getJobCategories();
  }

  // === NOUVEL ENDPOINT POUR L'UPLOAD DE CV ===
  @Put('resume')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('resumeFile')) // 'resumeFile' est le nom du champ (key)
  uploadResume(
    @Req() req: Request,
    @UploadedFile(
      // Valideurs de fichier
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: 'application/pdf' }), // Accepte que les PDF
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    const user = req.user as { sub: string };

    // On passe le fichier et l'ID au service
    return this.profileService.updateResume(user.sub, file);
  }

  // === ENDPOINT POUR SUPPRIMER LE CV ===
  @Delete('resume')
  @UseGuards(AuthGuard('jwt'))
  deleteResume(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.profileService.deleteResume(user.sub);
  }
}
