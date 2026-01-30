// This file defines the authentication controller with routes for signup, login, logout, and token refresh.

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signup route: POST /auth/signup
  // Registers a new user and returns access and refresh tokens
  @Post('signup')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 🔒 3 inscriptions par minute
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() dto: SignupDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signup(dto);
  }

  // Login route: POST /auth/login
  // Authenticates a user and returns access and refresh tokens
  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 900000 } }) // 🔒 5 tentatives par 15min
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(dto);
  }

  // Logout route: POST /auth/logout
  // Protected route, requires a valid JWT
  // Logs out the user by invalidating their refresh token
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.authService.logout(user.sub);
  }

  // Refresh tokens route: POST /auth/refresh
  // Protected route, requires a valid refresh token
  // Returns new access and refresh tokens
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user as { sub: string; refreshToken: string };
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
