import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor (
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ){

  }
  
  async save (chat: Chat) {
    try {
      this.chatRepository.save(chat);
    } catch (err) {
      console.log(err);
    }
  }
}
