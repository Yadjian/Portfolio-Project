// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Le payload du token que NOUS créons
type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { // 'jwt' est le nom par défaut
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET, // <-- On utilise notre secret !
    });
  }

  // Cette méthode est appelée par PassportJS après avoir validé le token
  // Elle injecte ce qu'on retourne dans `req.user`
  validate(payload: JwtPayload) {
    return payload; // On peut retourner l'objet entier, ou juste { userId: payload.sub }
  }
}
