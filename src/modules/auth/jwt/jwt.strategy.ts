import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayload } from '../interface/auth-payload.interface';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'e#9BX@JxK^t68U2h',
    });
  }

  async validate(payload: AuthPayload) {
    return { name: payload.name, email: payload.email, id: payload.id };
  }
}
