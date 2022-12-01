import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direct } from './entities/direct.entity';
import { UserModule } from 'src/user/user.module';
import { Group } from './entities/group.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Direct, Group]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService]
})
export class ChatModule { }
