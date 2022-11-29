import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MsgToClient, MsgToServer } from './chat.class';
import { CreateGroupDto, DirectDto, GroupDto, UpdateGroupDto, GroupInfoDto, GroupCommunityDto } from './dto/chat.dto';
import { Direct } from './entities/direct.entity';
import { Group } from './entities/group.entity';
import { Message } from './entities/message.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Direct) private directRepository: Repository<Direct>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private userService: UserService,
  ) { }

  async deleteDirectById(user_email: string, friend_login: string) {
    const user = await this.userService.findUserDirectByEmail(user_email);
    const friend = await this.userService.findUserDirectByNick(friend_login);

    if (!user || !friend)
      throw new InternalServerErrorException('User Not Found deleteDirectById');

    const direct = user.directs.filter((key: Direct) => {
      if (key.users.map((u) => u.nick).indexOf(friend.nick) >= 0)
        return key;
      return;
    }).at(0);

    if (!direct)
      return;

    user.directs = user.directs.filter((key) => {
      if (key.id === direct.id)
        return;
      return key;
    });

    friend.directs = friend.directs.filter((key) => {
      if (key.id === direct.id)
        return;
      return key;
    });

    try {
      await user.save();
      await friend.save();
      await this.directRepository.delete(direct.id);
    } catch (err) {
      throw new InternalServerErrorException('Error saving data in db DeleteDirectById', err);
    }

  }


  async findDirectById(id: string): Promise<Direct> {
    const direct: Direct | null = await this.directRepository.findOne({
      where: { id: id },
      relations: [
        'users',
        'messages',
        'messages.direct',
        'messages.sender',
      ], order: {
        messages: {
          date: 'asc'
        }
      }
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
    const user = await this.userService.findAllChats(login);
    if (!user)
      throw new BadRequestException('User Not Found getDirects');
    const chats = [...user.directs, ...user.groups];
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
      await this.setBreakpoint(user, chat, type);
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

  // Proteger pra quando o usuario for bloqueado ou o chat nao existir mais
  async setBreakpointController(email: string, chatId: string, type: string) {
    const user = await this.userService.findUserDirectByEmail(email);
    if (!user)
      throw new BadRequestException('User Not Found setBreakpoints');

    const chat: Direct | Group = type === 'direct' ?
      await this.findDirectById(chatId) :
      await this.findGroupById(chatId);
    if (!chat)
      return;
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

  // Impedir a criação de chats com pessoas bloqueadas
  async getFriendDirect(owner_email: string, friend_login: string) {

    const owner = await this.userService.findUserDirectByEmail(owner_email);
    const friend = await this.userService.findUserDirectByNick(friend_login);

    if (!owner || !friend)
      throw new BadRequestException('User Not Found getFrienddirect');

    if (this.userService.isBlocked(owner, friend) || this.userService.isBlocked(friend, owner))
      return;

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

  async createGroupDto(group: Group, owner: User | undefined, type: string) {
    const groupDto: GroupDto = {
      id: group.id,
      type: group.type,
      name: group.name,
      image: group.image,
      date: group.date,
      newMessages: 0
    };

    const messages: MsgToClient[] = group.messages
      .filter(msg => msg.breakproint === false
        || (msg.breakproint === true && msg.sender.nick === owner?.nick))
      .map((message: Message) => {
        return {
          id: message.id,
          chat: group.id,
          user: {
            login: message.sender.nick,
            image: message.sender.imgUrl,
          },
          date: message.date,
          msg: message.msg,
          breakpoint: message.breakproint,
        };
      });

    if (type === 'activeGroup') {
      groupDto.messages = messages;
      // groupDto.owner = {
      //   name: group.owner.nick,
      //   image: group.owner.imgUrl
      // };
      // groupDto.admins = group.admins.map((user: User) => {
      //   return {
      //     name: user.nick,
      //     image: user.imgUrl,
      //   };
      // });
      // groupDto.members = group.users.map((user: User) => {
      //   return {
      //     name: user.nick,
      //     image: user.imgUrl,
      //   };
      // });
    }

    groupDto.newMessages = await this.getBreakpoint(messages);

    return groupDto;
  }

  async findGroupInfosById(id: string) {
    return await this.groupRepository.findOne({
      where: {
        id
      },
      relations: [
        'users',
        'admins',
        'owner',
      ]
    });
  }


  async createGroup(group: CreateGroupDto) {

    const owner = await this.userService.findUserGroupByNick(group.owner);

    if (!owner)
      throw new BadRequestException('User Not Found getFriendDirect');

    const newGroup = new Group();

    const ownerBreakpoint = new Message();
    ownerBreakpoint.sender = owner;
    ownerBreakpoint.date = new Date(Date.now());
    ownerBreakpoint.msg = '';
    ownerBreakpoint.breakproint = true;

    newGroup.type = group.type;
    newGroup.name = group.name;
    newGroup.password = group.password ? bcrypt.hashSync(group.password, 8) : null;
    newGroup.image = group.image ? group.image : 'userDefault.png';

    newGroup.owner = owner;
    newGroup.users = [owner];
    newGroup.admins = [];
    newGroup.messages = [ownerBreakpoint];
    newGroup.groupController = [];
    newGroup.date = new Date(Date.now());

    try {
      await this.groupRepository.save(newGroup);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error saving group in db');
    }

    return await this.createGroupDto(newGroup, owner, 'activeGroup');
  }

  async getGroup(owner_email: string, id: string) {
    const group = await this.findGroupById(id);
    if (!group)
      throw new BadRequestException('Invalid group GetGroup');
    const owner = group.users.filter((key: User) => key.email === owner_email).at(0);
    if (!owner)
      throw new BadRequestException('Invalid user GetGroup');
    return this.createGroupDto(group, owner, 'activeGroup');
  }

  async getGroupInfosById(id: string) {
    const group = await this.findGroupInfosById(id);
    if (!group)
      throw new BadRequestException('Invalid group GetGroup');
    const groupInfo: GroupInfoDto = {
      id: group.id,
      owner: {
        name: group.owner.nick,
        image: group.owner.imgUrl
      },
      admins: group.admins.map((user: User) => {
        return {
          name: user.nick,
          image: user.imgUrl,
        };
      }),
      members: group.users.map((user: User) => {
        return {
          name: user.nick,
          image: user.imgUrl,
        };
      }),
      image: group.image,
      name: group.name,
    };
    return groupInfo;
  }

  async getAllGroups(user_email: string) {
    const owner = await this.userService.findUserGroupByEmail(user_email);
    if (!owner)
      throw new BadRequestException('User Not Found getDirects');
    const groups: GroupDto[] = await Promise.all(owner.groups.map(async (group) => {
      return await this.createGroupDto(group, owner, 'cardGroup');
    }));
    return groups;
  }

  async getCommunityGroups(user_email: string): Promise<GroupCommunityDto[] | void> {
    const groups = await this.groupRepository.find({
      relations: [
        'users',
      ]
    });
    if (!groups)
      return;

    let groupsDto: GroupCommunityDto[] = groups.map((group) => {
      return {
        id: group.id,
        type: group.type,
        name: group.name,
        image: group.image,
        date: group.date,
        member: group.users.map(e => e.email).indexOf(user_email) >= 0,
        size: group.users.length,
      };
    });

    groupsDto = groupsDto.filter(group => group.type !== 'private'
      || (group.type === 'private' && group.member))
      .sort((a, b) => a.size < b.size ? 1 : -1);

    return groupsDto;
  }

  async updateGroup(user_email: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findGroupInfosById(updateGroupDto.id);
    if (!group)
      throw new BadRequestException('Group not Found updateGroup');
    const {
      // id,
      // admins,
      date,
      image,
      name,
      // owner,
      type,
      password
      // users,
      // messages,
      // newMessages,
    } = updateGroupDto;
    const user = await this.userService.findUserByEmail(user_email);
    if (!user || user.nick !== group.owner.nick) {

      throw new UnauthorizedException('Permission denied');
    }

    // group.users = users ? users : group.users
    // group.admins = admins ? admins : group.admins
    // group.owner = ? : group.owner
    group.date = date ? date : group.date;
    group.name = name ? name : group.name;
    group.type = type ? type : group.type;
    group.password = password ? bcrypt.hashSync(password, 8) : group.password;
    if (image) {
      if (group.image !== 'userDefault.png') {
        fs.rm(
          `../web/public/${group.image}`,
          function (err) {
            if (err) throw err;
          }
        );
      }
      group.image = image;
    }

    try {
      await group.save();
      // return user;
    } catch (error) {
      throw new InternalServerErrorException('Error saving user update');
    }
  }


  async joinGroup(user_email: string, id: string) {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const group = await this.findGroupById(id);
    if (!user || !group)
      throw new BadRequestException('Invalid Request joinGroup');

    group.users.push(user);
    try {
      group.save();
    } catch (err) {
      throw new InternalServerErrorException('Error sabing group joinGroup');
    }
  }


  async leaveGroup(user_email: string, id: string) {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const group = await this.findGroupById(id);
    if (!user || !group)
      throw new BadRequestException('Invalid Request joinGroup');

    group.users = group.users.filter((key) => {
      if (key.email === user.email)
        return;
      return key;
    });

    try {
      group.save();
    } catch (err) {
      throw new InternalServerErrorException('Error sabing group joinGroup');
    }
  }



}