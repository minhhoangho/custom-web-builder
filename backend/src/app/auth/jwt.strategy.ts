import loadConfig from 'src/configs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from '@app/user/entities/user.entity';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUserContext } from '@common/context';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract jwt from header
      ignoreExpiration: false,
      secretOrKey: loadConfig.jwt.jwtSecret,
      passReqToCallback: true,
    });
  }

  /**
   *  @Usage A "verify callback", which is where you tell Passport how to interact with your user store
   */
  async validate(req: Request, payload: any): Promise<User> {
    const token: string = (req.get('authorization')?? ' ').split(' ')[1];
    const user: User = await this.authService.verifyAccessToken(token, payload);
    CurrentUserContext.set(user);
    return user;
  }
}
