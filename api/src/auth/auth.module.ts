import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from './constants/constants';
import { TfaService } from './tfa/tfa.service';
import { ConfigModule } from '@nestjs/config';
import { TfaController } from './tfa/tfa.controller';

@Module({
  controllers: [AuthController,  TfaController],
  providers: [AuthService, JwtStrategy, TfaService],
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret as string,
      signOptions: {
        expiresIn: '30d'
      }
    })
  ]

})
export class AuthModule { }
