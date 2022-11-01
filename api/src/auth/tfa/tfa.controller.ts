import { ClassSerializerInterceptor, Controller, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TfaService } from './tfa.service';
// import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Response } from 'express';
import { UserFromJwt } from '../dto/UserFromJwt.dto';
import { GetUserFromJwt } from '../decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @GetUserFromJwt() userFromJwt: UserFromJwt) {
    // console.log('request user tfa controler register', userFromJwt);
    const { otpauthUrl } = await this.tfaService.generateTFASecret(userFromJwt as User);
    this.tfaService.pipeQrCodeStream(response, otpauthUrl);
    return await this.tfaService.pipeQrCodeStream(response, otpauthUrl);
  }
}

