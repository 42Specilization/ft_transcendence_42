import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { UserFromJwt } from '../dto/UserFromJwt.dto';
import { UserPayload } from '../dto/UserPayload.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET']
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    const user = await this.userService.findUserByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    return ({
      email: payload.email,
      token: payload.token,
      tfaEmail: payload.tfaEmail,
    });
  }
}
