import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccessTokenResponse } from './dto/AccessTokenResponse.dto';
import { IntraData } from './dto/IntraData.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Get('code/:code')
  async signUp(@Param('code') code: string): Promise<AccessTokenResponse> {
    return (await this.authService.signUp(code));
  }

  @Get('me/:token')
  async getMe(@Param('token') token: string): Promise<IntraData> {
    return (await this.authService.getData(token));
  }

}
