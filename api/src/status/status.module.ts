import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { StatusGateway } from './status.gateway';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [StatusGateway],
})
export class StatusModule { }

