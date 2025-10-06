import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface Auth0User {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  // Ajoutez d'autres champs selon vos besoins
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Auth0User): Promise<Auth0User> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    
    // Vous pouvez ajouter ici une logique pour synchroniser l'utilisateur avec votre DB
    // Par exemple : vérifier si l'utilisateur existe dans votre base de données
    
    return payload;
  }
}
