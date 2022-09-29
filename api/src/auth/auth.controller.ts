import { Controller, Get, Param, Request, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { JwtTokenAccess } from './dto/JwtTokenAccess.dto';
import { UserFromJwt } from './dto/UserFromJwt.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @IsPublic()
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async signUpOrSignIn(@Param('code') code: string): Promise<JwtTokenAccess> {
    return (await this.authService.signUpOrSignIn(code));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@Request() req: { user: UserFromJwt }): User {
    return (this.authService.getUserInfos(req.user));
  }

}
