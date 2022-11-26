import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from './constants/constants';
import { HttpModule } from '@nestjs/axios';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret as string,
      signOptions: {
        expiresIn: '30d'
      }
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000
      })
    })
  ]

})
export class AuthModule { }
