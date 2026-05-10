/* eslint-disable @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  organizationId: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET_KEY');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('User Not Found');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      phone: payload.phone,
      organizationId: payload.organizationId,
    };
  }
}
