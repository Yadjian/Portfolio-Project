// Fichier: backend/src/auth/auth.controller.ts

import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync-user')
  @UseGuards(AuthGuard('jwt')) // Protège la route et valide le token
  async syncUser(@Req() req: Request) {
    // req.user est rempli par la JwtStrategy avec les infos du token
    return this.authService.syncUser(req.user);
  }
}
