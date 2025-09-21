import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', {
      sub: payload.sub,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    });

    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      console.log('JWT Strategy - User not found for ID:', payload.sub);
      throw new UnauthorizedException();
    }

    console.log('JWT Strategy - User validated successfully:', {
      id: user.id,
      email: user.email,
    });
    return user;
  }
}
