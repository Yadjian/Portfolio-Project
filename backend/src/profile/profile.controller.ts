// Fichier: backend/src/profile/profile.controller.ts

import { Controller, Get, Put, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

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
}
