import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { DirectDto } from './dto/chat.dto';
import { CreateDirectDto } from './dto/create-direct.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor (
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private userService: UserService,
  ){

  }

  async createDirect(owner_email: string, chat_infos: CreateDirectDto){
    const chat  = new Chat();
    const owner = await this.userService.findUserByEmail(owner_email);
    const friend = await this.userService.findUserByNick(chat_infos.friend_login);

    if(!owner || !friend){
      throw new BadRequestException('User not found creating chat');
    }
    chat.users = [];
    chat.type = 'direct';
    chat.users.push(owner);
    chat.users.push(friend);
    try {
      await this.chatRepository.save(chat);
    }catch(err){
      console.log(err);
    }
  }

  
  async save (chat: Chat) {
    try {
      this.chatRepository.save(chat);
    } catch (err) {
      console.log(err);
    }
  }

  async getDirects(user_email: string) {
    const user = await this.userService.findUserByEmail(user_email);
    if (!user) 
      throw new BadRequestException('User Not Found getDirects');

    const directs : DirectDto[] = user.chats.filter((chat) => chat.type == 'direct')
      .map((chat)=>{
        const friend = chat.users.filter((key) => key.nick != user.nick).at(0);
        return {
          id: chat.id,
          type: chat.type,
          name: friend?.nick,
          image: friend?.imgUrl,
          users: chat.users.map((user) => {
            return {
              login: user.nick,
              image_url: user.imgUrl,
            };
          })
        };
      });
    return directs;
  }
}
