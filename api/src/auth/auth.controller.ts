import { Controller, Get, Param, HttpCode, HttpStatus, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { GetUserFromJwt } from './decorators/get-user.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { JwtTokenAccess } from './dto/JwtTokenAccess.dto';
import { SignInUserDto } from './dto/SignInUser.dto';
import { UserFromJwt } from './dto/UserFromJwt.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @IsPublic()
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async signUpOrSignIn(@Param('code') code: string): Promise<JwtTokenAccess> {
    return (await this.authService.signUpOrSignIn(code));
  }

  @IsPublic()
  @ApiBody({type: CreateUserDto})
  @Post('createUser')
  async signUpWithoutIntra(@Body() createUserDto: CreateUserDto) {
    return (await this.authService.signUpWithoutIntra(createUserDto));
  }

  @IsPublic()
  @ApiBody({type: SignInUserDto})
  @Post('signInWithoutIntra')
  async signInWithoutIntra(@Body() signInUserDto: SignInUserDto) {
    return (await this.authService.signInWithoutIntra(signInUserDto));
  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@GetUserFromJwt() userFromJwt: UserFromJwt): Promise<UserDto> {
    return (await this.authService.getUserInfos(userFromJwt));
  }

  @Get('validateToken')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateToken(@GetUserFromJwt() userFromJwt: UserFromJwt) {
    return (await this.authService.validateToken(userFromJwt));
  }

  @Post('passwordRecoverySendEmail')
  // @ApiBody({type: string})
  async passwordRecoverySendEmail(@Body() email: {email: string}) {
    return ( await this.authService.passwordRecoverySendEmail(email.email));
  }


  @Post('validateRecoveryPasswordCode')
  async validateRecoveryPasswordCode(@Body() code: {code: string, email: string}) {
    return (await this.authService.validateRecoveryPasswordCode(code));
  }

  @Post('changePassword')
  async changePassword(@Body() changePasswordDto: {password: string, confirmPassword: string, email: string}) {
    return (await this.authService.changePassword(changePasswordDto));
  }

  // @Get('email/:email')
  // async generateJwtToken(@Param('email') email: string): Promise<JwtTokenAccess> {
  //   return (await this.authService.generateJwtToken(email));
  // }

}
