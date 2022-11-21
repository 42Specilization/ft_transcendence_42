import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MsgToClient, MsgToServer } from './chat.class';
import { DirectDto } from './dto/chat.dto';
import { Direct } from './entities/direct.entity';
import { Group } from './entities/group.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Direct) private directRepository: Repository<Direct>,
    @InjectRepository(Direct) private groupRepository: Repository<Group>,
    private userService: UserService,
  ) {

  }

  async findDirectById(id: string): Promise<Direct> {
    const direct: Direct | null = await this.directRepository.findOne({
      where: { id: id },
      relations: [
        'users',
        'messages',
        'messages.direct',
        'messages.sender',
      ]
    });
    if (!direct)
      throw new NotFoundException('Direct not found');
    return direct;
  }

  async findGroupById(id: string): Promise<Group> {
    const group: Group | null = await this.groupRepository.findOne({
      where: { id: id },
      relations: [
        'users',
        'messages',
        'messages.group',
        'messages.sender',
      ]
    });
    if (!group)
      throw new NotFoundException('Group not found');
    return group;
  }

  async saveMessage(msgServer: MsgToServer, type: string): Promise<MsgToClient> {
    const user: User = await this.userService.findUserByNick(msgServer.user) as User;

    const chat: Direct | Group = type === 'direct' ?
      await this.findDirectById(msgServer.chat) :
      await this.findGroupById(msgServer.chat);

    const msgDb = new Message();

    msgDb.sender = user;
    msgDb.date = new Date(Date.now());
    msgDb.msg = msgServer.msg;

    if (chat.messages && chat.messages.length === 0)
      chat.messages = [];
    chat.messages.push(msgDb);
    chat.date = msgDb.date;

    try {
      if (type === 'direct')
        await this.directRepository.save(chat);
      else
        await this.groupRepository.save(chat);

      const msgClient: MsgToClient = {
        id: msgDb.id,
        chat: chat.id,
        user: { login: user.nick, image: user.imgUrl },
        date: msgDb.date,
        msg: msgDb.msg,
      };
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Error saving message in db');
    }
  }

  createDirectDto(direct: Direct, user: User | undefined): DirectDto {
    const directDto: DirectDto = {
      id: direct.id,
      type: 'direct',
      name: user?.nick,
      image: user?.imgUrl,
      date: direct.date,
      messages: direct.messages?.map((message: Message) => {
        return {
          id: message.id,
          chat: direct.id,
          user: {
            login: message.sender.nick,
            image: message.sender.imgUrl,
          },
          date: message.date,
          msg: message.msg,
        };
      }),
    };

    return directDto;
  }

  async getAllDirects(user_email: string) {
    const user = await this.userService.findUserDirectByEmail(user_email);
    if (!user)
      throw new BadRequestException('User Not Found getDirects');
    const directs: DirectDto[] = user.directs.map((direct) => {
      const friend = direct.users.filter((key) => key.nick != user.nick).at(0);
      return this.createDirectDto(direct, friend);
    });
    return directs;
  }

  async getDirect(owner_email: string, id: string): Promise<DirectDto> {
    const direct = await this.findDirectById(id);
    if (!direct)
      throw new BadRequestException('Invalid direct GetDirect');
    const user = direct.users.filter((key: User) => key.email != owner_email).at(0);
    if (!user)
      throw new BadRequestException('Invalid user GetDirect');
    return this.createDirectDto(direct, user);
  }

  async getFriendDirect(owner_email: string, friend_login: string): Promise<DirectDto> {

    const owner = await this.userService.findUserDirectByEmail(owner_email);
    const friend = await this.userService.findUserDirectByNick(friend_login);

    if (!owner || !friend)
      throw new BadRequestException('User Not Found getFrienddirect');

    const directs: Direct[] = owner.directs.filter((key: Direct) => {
      if (key.users.map((u: User) => u.nick).indexOf(friend.nick) >= 0)
        return key;
      return;
    });

    let direct;

    if (directs.length < 1) {
      const newDirect = new Direct();
      newDirect.users = [owner, friend];
      newDirect.date = new Date(Date.now());
      try {
        await this.directRepository.save(newDirect);
        direct = newDirect;
      } catch (err) {
        throw new InternalServerErrorException('Error saving direct in db');
      }
    } else {
      direct = await this.findDirectById(directs[0].id);
    }

    return this.createDirectDto(direct, friend);
  }
}
