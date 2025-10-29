// This file defines a custom guard that uses the JWT authentication strategy.
// It protects routes by ensuring that a valid JWT is present in the request.

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard extends the built-in AuthGuard with the 'jwt' strategy.
// Use this guard to protect endpoints that require authentication.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
