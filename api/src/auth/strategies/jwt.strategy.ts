import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { UserFromJwt } from '../dto/UserFromJwt.dto';
import { UserPayload } from '../dto/UserPayload.dto';
import { jwtConstants } from '../constants/constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret as string
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {

    const user = this.userService.getUser(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    return ({
      email: payload.email,
      token: payload.token
    });
  }
}