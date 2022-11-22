import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { StatusGateway } from './status.gateway';

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [StatusGateway],
})
export class StatusModule { }

