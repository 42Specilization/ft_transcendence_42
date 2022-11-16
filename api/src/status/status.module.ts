import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [StatusGateway],
})
export class StatusModule { }
