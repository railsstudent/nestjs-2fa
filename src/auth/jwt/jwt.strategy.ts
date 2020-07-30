import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { jwtConstants } from '../constants';
import { LoginDto, User } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-tfa') {
  constructor(private readonly service: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      algorithms: 'HS512',
    });
  }

  async validate(payload: LoginDto, done: (err: Error | null, user?: User | boolean) => void) {
    console.log('validate');
    try {
      const user = await this.service.allUsers().find(u => u.email === payload.email);
      if (!user) {
        return done(new UnauthorizedException('Invalid JWT token'), false);
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
}