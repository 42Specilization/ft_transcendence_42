import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { User } from 'src/user/entities/user.entity';
import { toFileStream } from 'qrcode';
import { Response } from 'express';


@Injectable()
export class TfaService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async generateTFASecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME') as string,  secret);
    // console.log(secret);
    await this.userService.setTFASecret(secret, user.email);
    return {
      secret,
      otpauthUrl
    };
  }

  public async pipeQrCodeStream(stream : Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }


}
