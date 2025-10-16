// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route d'inscription: /auth/signup
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  // On utilise notre nouveau DTO ici
  signup(@Body() dto: SignupDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signup(dto);
  }

  // Route de connexion: /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(dto);
  }

  // Route de déconnexion: /auth/logout
  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Protégée, il faut être connecté pour se déconnecter
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.authService.logout(user.sub);
  }
}
