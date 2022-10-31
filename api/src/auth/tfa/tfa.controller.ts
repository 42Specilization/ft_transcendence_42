import { ClassSerializerInterceptor, Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TfaService } from './tfa.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Response } from 'express';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    console.log( request.user);
    const { otpauthUrl } = await this.tfaService.generateTFASecret(request.user);
    return this.tfaService.pipeQrCodeStream(response, otpauthUrl);
  }


}

