// This file defines the JWT authentication strategy for validating access tokens.

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// The payload structure of the JWT we generate
type JwtPayload = {
  sub: string; // User ID
  email: string; // User email
};

@Injectable()
// JwtStrategy configures Passport to use JWTs for authentication.
// The 'jwt' string is the default strategy name.
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_ACCESS_SECRET, // Secret key for verifying token signature
    });
  }

  // This method is called by Passport after the token is validated.
  // The returned value is attached to req.user in route handlers.
  validate(payload: JwtPayload) {
    return payload; // You can return the whole payload or a subset (e.g., { userId: payload.sub })
  }
}
