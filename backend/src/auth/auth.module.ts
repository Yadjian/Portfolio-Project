// This file defines the AuthModule, which bundles authentication-related components and dependencies.

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // JWT authentication strategy
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module'; // Database access module
import { JwtModule } from '@nestjs/jwt'; // JWT utilities for token creation/validation
import { RefreshTokenStrategy } from './refreshToken.strategy'; // Strategy for handling refresh tokens

@Module({
  imports: [
    // Registers Passport with JWT as the default authentication strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Registers the JWT module (configuration will be set in the service)
    JwtModule.register({}),
    // Imports PrismaModule for database operations
    PrismaModule,
  ],
  // Registers the authentication controller
  controllers: [AuthController],
  // Registers providers: authentication service and strategies
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
