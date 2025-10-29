// This file defines the JWT strategy for validating refresh tokens.

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
// RefreshTokenStrategy configures Passport to use JWTs for refresh token validation.
// The strategy is named 'jwt-refresh'.
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET, // Secret key for verifying refresh token signature
      passReqToCallback: true, // Allows access to the request object in the validate method
    });
  }

  // This method is called after the refresh token is validated.
  // It attaches the refresh token and payload to req.user.
  validate(req: Request, payload: any) {
    // Extract the refresh token from the Authorization header
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
