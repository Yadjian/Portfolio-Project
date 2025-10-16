// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // Nous allons le modifier
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // <-- AJOUTÉ
import { RefreshTokenStrategy } from './refreshToken.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // <-- AJOUTÉ: configuration vide, nous la ferons dans le service
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy], // <-- Nous allons réécrire AuthService
})
export class AuthModule {}
