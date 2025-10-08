// Fichier: backend/src/profile/profile.controller.ts

import { Controller, Get, Put, UseGuards, Req, Body } from '@nestjs/common'; // Ajoutez Put et Body
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto'; // Importez le DTO

@Controller('profile') // Toutes les routes de ce contrôleur commenceront par /profile
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me') // Définit la route GET /profile/me
  @UseGuards(AuthGuard('jwt')) // Protège la route avec notre stratégie JWT
  getProfile(@Req() req: Request) {
    // req.user est le payload du token, attaché par le AuthGuard
    const auth0Id = req.user.sub;
    
    // On passe l'ID de l'utilisateur au service pour qu'il récupère les données
    return this.profileService.getUserProfile(auth0Id);
  }

    @Put('me') // Définit la route PUT /profile/me
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const auth0Id = req.user.sub;
    
    // On passe l'ID et les nouvelles données au service
    return this.profileService.updateUserProfile(auth0Id, updateProfileDto);
  }
}
