import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MsgToClient, MsgToServer } from './chat.class';
import { DirectDto } from './dto/chat.dto';
import { CreateDirectDto } from './dto/create-direct.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

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

  async findChatById(id: string): Promise<Chat> {
    const chat: Chat | null = await this.chatRepository.findOne({
      where: { id: id}
    })
    if (!chat)
      throw new NotFoundException("Chat não encontrado");
    return chat;
  }

  async createChat(type: string , usersLogin: string[]): Promise<string> {
    const users: User[] = await Promise.all(usersLogin.map(async (e) =>
      await this.userService.findUserByNick(e))
    ) as User[];

    const chat = new Chat();
    chat.type = type;
    chat.users = users;

    try {
      this.chatRepository.save(chat);
      return chat.id;
    } catch (err) {
      throw new InternalServerErrorException('Erro ao salvar os dados no db');
    }
  }

  async saveMessage(msgServer: MsgToServer): Promise<MsgToClient> {
    const user: User = await this.userService.findUserByNick(msgServer.user) as User;
    const chat: Chat = await this.findChatById(msgServer.chat);

    const msgDb = new Message();
    msgDb.sender = user;
    msgDb.date = new Date(Date.now());

    if (chat.messages && chat.messages.length === 0)
      chat.messages = []
    chat.messages.push(msgDb);

    const msgClient: MsgToClient = {
      id: msgDb.id,
      chat: chat.id,
      user: {login: user.nick, image: user.imgUrl},
      date: msgDb.date,
    }

    try {
      this.chatRepository.save(chat);
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Erro ao salvar os dados no db');
    }
  }
}
