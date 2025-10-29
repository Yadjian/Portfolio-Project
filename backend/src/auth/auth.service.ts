// src/auth/auth.service.ts

// This service handles authentication logic: signup, login, logout, and token management.

import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto, UserRole } from './dto/signup.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- SIGNUP (REGISTER NEW USER) ---
  async signup(dto: SignupDto): Promise<{ accessToken: string; refreshToken:string }> {
    const { email, password, role } = dto;

    // 1. Check if a user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // 2. If user exists, throw a conflict error
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    // 3. Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Use a transaction to create both User and Profile atomically
    const newUser = await this.prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      // Create the associated profile based on the role
      if (role === UserRole.CANDIDATE) {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            firstName: '',
            lastName: '',
          },
        });
      } else if (role === UserRole.RECRUITER) {
        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
            firstName: '',
            lastName: '',
          },
        });
      }

      return user;
    });

    // 5. Generate and return access and refresh tokens
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  // --- LOGIN (AUTHENTICATE USER) ---
  async login(dto: AuthDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // 2. If user not found, throw unauthorized error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // 3. Compare provided password with stored hash
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) { 
      throw new UnauthorizedException('Invalid credentials.');
    }

    // 4. Generate and return tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }
  
  // --- LOGOUT (REMOVE REFRESH TOKEN) ---
  async logout(userId: string): Promise<void> { 
    // Remove the user's refresh token hash from the database
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  // --- REFRESH TOKENS (ISSUE NEW TOKENS USING REFRESH TOKEN) ---
  async refreshTokens(userId: string, refreshToken: string) {
    // 1. Find the user and their current hashed refresh token
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

    // 2. Compare provided refresh token with stored hash
    const tokensMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!tokensMatch) throw new ForbiddenException('Access Denied');

    // 3. Generate new tokens
    const newTokens = await this.getTokens(user.id, user.email);

    // 4. Update the stored refresh token hash
    await this.updateRefreshTokenHash(user.id, newTokens.refreshToken);

    // 5. Return the new tokens
    return newTokens;
  }

  // --- HELPER: Update the user's refresh token hash in the database ---
  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  // --- HELPER: Generate access and refresh JWT tokens ---
  private async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    // Generate both tokens in parallel
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m', // Short lifetime for access token
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d', // Longer lifetime for refresh token
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
