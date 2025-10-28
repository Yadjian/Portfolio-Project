// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 🔒 3 inscriptions par minute
  @HttpCode(HttpStatus.CREATED)
  // On utilise notre nouveau DTO ici
  signup(@Body() dto: SignupDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signup(dto);
  }

  // Route de connexion: /auth/login
  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 900000 } }) // 🔒 5 tentatives par 15min
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

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh')) // On utilise notre nouvelle garde
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user as { sub: string; refreshToken: string };
    return this.authService.refreshTokens(user.sub, user.refreshToken);
}
}
