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

  async getAllChatsId(login: string) {
    const user = await this.userService.findUserDirectByNick(login);
    if (!user)
      throw new BadRequestException('User Not Found getDirects');
    // const directs: DirectDto[] = user.directs.map((direct) => {
    //   const friend = direct.users.filter((key) => key.nick != user.nick).at(0);
    //   return this.createDirectDto(direct, friend);
    // });
    const chats = [...user.directs];
    return chats.map((chat) => chat.id);
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

    chat.messages.push(msgDb);
    chat.date = msgDb.date;

    try {
      if (type === 'direct')
        await this.directRepository.save(chat);
      else
        await this.groupRepository.save(chat);
      this.setBreakpoint(user, chat, type);
      const msgClient: MsgToClient = {
        id: msgDb.id,
        chat: chat.id,
        user: { login: user.nick, image: user.imgUrl },
        date: msgDb.date,
        msg: msgDb.msg,
        breakpoint: false,
      };
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Error saving message in db');
    }

  }

  async setBreakpointController(email: string, chatId: string, type: string) {
    const user = await this.userService.findUserDirectByEmail(email);
    if (!user)
      throw new BadRequestException('User Not Found setBreakpoints');

    const chat: Direct | Group = type === 'direct' ?
      await this.findDirectById(chatId) :
      await this.findGroupById(chatId);
    this.setBreakpoint(user, chat, type);
  }

  async setBreakpoint(user: User, chat: Direct | Group, type: string) {
    let index = 0;
    chat.messages.forEach((msg, i) => {
      if (msg.breakproint === true && msg.sender.nick === user?.nick)
        index = i;
    });

    chat.messages[index].date = new Date(Date.now());

    try {
      if (type === 'direct')
        await this.directRepository.save(chat);
      else
        await this.groupRepository.save(chat);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }


  async getBreakpoint(messages: MsgToClient[] | undefined): Promise<number> {

    let newMessages = 0;
    const breakpoint: Date | undefined = messages?.filter((msg) => msg.breakpoint === true).at(0)?.date;
    if (breakpoint) {
      messages?.forEach(msg => {
        if (msg.date > breakpoint)
          newMessages++;
      });
    }
    return newMessages;
  }


  async createDirectDto(direct: Direct, owner: User | undefined, friend: User | undefined, type: string): Promise<DirectDto> {
    owner;
    const directDto: DirectDto = {
      id: direct.id,
      type: 'direct',
      name: friend?.nick,
      image: friend?.imgUrl,
      date: direct.date,
      newMessages: 0
    };

    const messages: MsgToClient[] = direct.messages
      .filter(msg => msg.breakproint === false
        || (msg.breakproint === true && msg.sender.nick === owner?.nick))
      .map((message: Message) => {
        return {
          id: message.id,
          chat: direct.id,
          user: {
            login: message.sender.nick,
            image: message.sender.imgUrl,
          },
          date: message.date,
          msg: message.msg,
          breakpoint: message.breakproint,
        };
      });

    if (type === 'activeDirect') {
      directDto.messages = messages;
    }

    directDto.newMessages = await this.getBreakpoint(messages);

    return directDto;
  }

  async getAllDirects(user_email: string) {
    const owner = await this.userService.findUserDirectByEmail(user_email);
    if (!owner)
      throw new BadRequestException('User Not Found getDirects');
    const directs: DirectDto[] = await Promise.all(owner.directs.map(async (direct) => {
      const friend = direct.users.filter((key) => key.nick !== owner.nick).at(0);
      return await this.createDirectDto(direct, owner, friend, 'cardDirect');
    }));
    return directs;
  }


  async getDirect(owner_email: string, id: string): Promise<DirectDto> {
    const direct = await this.findDirectById(id);
    if (!direct)
      throw new BadRequestException('Invalid direct GetDirect');
    const owner = direct.users.filter((key: User) => key.email === owner_email).at(0);
    const friend = direct.users.filter((key: User) => key.email !== owner_email).at(0);
    if (!owner && !friend)
      throw new BadRequestException('Invalid user GetDirect');
    return this.createDirectDto(direct, owner, friend, 'activeDirect');
  }

  async getFriendDirect(owner_email: string, friend_login: string):
    Promise<{ directDto: DirectDto, created: boolean }> {

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
    let created: boolean;

    if (directs.length < 1) {
      created = true;
      const newDirect = new Direct();
      newDirect.users = [owner, friend];
      newDirect.date = new Date(Date.now());

      const ownerBreakpoint = new Message();
      ownerBreakpoint.sender = owner;
      ownerBreakpoint.date = new Date(Date.now());
      ownerBreakpoint.msg = '';
      ownerBreakpoint.breakproint = true;

      const friendBreakpoint = new Message();
      friendBreakpoint.sender = friend;
      friendBreakpoint.date = new Date(Date.now());
      friendBreakpoint.msg = '';
      friendBreakpoint.breakproint = true;

      newDirect.messages = [friendBreakpoint, ownerBreakpoint];
      try {
        await this.directRepository.save(newDirect);
        direct = newDirect;
      } catch (err) {
        throw new InternalServerErrorException('Error saving direct in db');
      }
    } else {
      created = false;
      direct = await this.findDirectById(directs[0].id);
    }

    return {
      directDto: await this.createDirectDto(direct, owner, friend, 'activeDirect'),
      created: created,
    };

  }
}
