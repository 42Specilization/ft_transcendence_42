import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MsgToClient, MsgToServer } from './chat.class';
import { CreateGroupDto, DirectDto, GroupDto, UpdateGroupDto, GroupInfoDto, GroupCommunityDto, RemoveMemberDto, GroupInviteDto } from './dto/chat.dto';
import { Direct } from './entities/direct.entity';
import { Group } from './entities/group.entity';
import { Message } from './entities/message.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Notify } from 'src/notification/entities/notify.entity';

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
        'owner',
        'messages',
        'messages.group',
        'messages.sender',
      ], order: {
        messages: {
          date: 'asc'
        }
      }
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

  async saveMessage(msgServer: MsgToServer, type: string): Promise<MsgToClient | undefined> {
    const user: User = await this.userService.findUserByNick(msgServer.user) as User;

    const chat: Direct | Group = type === 'direct' ?
      await this.findDirectById(msgServer.chat) :
      await this.findGroupById(msgServer.chat);

    if (!user || !chat)
      throw new BadRequestException('Invalid Request saveMessage');

    if (chat.users.map(e => e.email).indexOf(user.email) < 0)
      return undefined;

    const msgDb = new Message();

    msgDb.sender = user;
    msgDb.date = new Date(Date.now());
    msgDb.msg = msgServer.msg;
    msgDb.type = 'message';

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
        type: msgDb.type,
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
    if (!chat)
      return;
    this.setBreakpoint(user, chat, type);
  }

  async setBreakpoint(user: User, chat: Direct | Group, type: string) {
    let index = 0;
    chat.messages.forEach((msg, i) => {
      if (msg.type === 'breakpoint' && msg.sender.nick === user.nick)
        index = i;
    });

    if (index === chat.messages.length
      || chat.messages[index].type !== 'breakpoint'
      || chat.messages[index].sender.nick !== user.nick)
      return;
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
    const breakpoint: Date | undefined = messages?.filter((msg) => msg.type === 'breakpoint').at(0)?.date;
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
      .filter(msg => msg.type !== 'breakpoint'
        || (msg.type === 'breakpoint' && msg.sender.nick === owner?.nick))
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
          type: message.type,
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

  async getFriendDirect(owner_email: string, friend_login: string) {

    const owner = await this.userService.findUserDirectByEmail(owner_email);
    const friend = await this.userService.findUserDirectByNick(friend_login);

    if (!owner || !friend)
      throw new BadRequestException('User Not Found getFrienddirect');

    if (owner.nick === friend.nick)
      throw new UnauthorizedException('You cant talk with you getFrienddirect');

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
      ownerBreakpoint.type = 'breakpoint';

      const friendBreakpoint = new Message();
      friendBreakpoint.sender = friend;
      friendBreakpoint.date = new Date(Date.now());
      friendBreakpoint.msg = '';
      friendBreakpoint.type = 'breakpoint';

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
      .filter(msg => msg.type !== 'breakpoint'
        || (msg.type === 'breakpoint' && msg.sender.nick === owner?.nick))
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
          type: message.type,
        };
      });

    if (type === 'activeGroup') {
      groupDto.messages = messages;
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

    newGroup.type = group.type;
    newGroup.name = group.name;
    newGroup.password = group.password ? bcrypt.hashSync(group.password, 8) : null;
    newGroup.image = group.image ? group.image : 'userDefault.png';
    newGroup.owner = owner;
    newGroup.users = [];
    newGroup.admins = [];
    newGroup.messages = [];
    newGroup.groupController = [];
    newGroup.date = new Date(Date.now());

    try {
      await this.groupRepository.save(newGroup);
      return newGroup.id;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error saving group in db');
    }
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

  async getProfileGroupById(id: string) {
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

  async joinGroup(user_email: string, id: string): Promise<MsgToClient | null | undefined> {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const group = await this.findGroupById(id);
    if (!user || !group)
      throw new BadRequestException('Invalid Request joinGroup');

    if (group.users.map(e => e.email).indexOf(user_email) >= 0)
      return undefined;

    const firstUser: boolean = group.users.length === 0;

    const join = new Message();
    join.sender = user;
    join.date = new Date(Date.now());
    join.msg = 'joined the group';
    join.type = 'action';

    const breakpoint = new Message();
    breakpoint.sender = user;
    breakpoint.date = new Date(Date.now() + 1);
    breakpoint.msg = '';
    breakpoint.type = 'breakpoint';

    group.users.push(user);
    if (!firstUser)
      group.messages.push(join);
    group.messages.push(breakpoint);

    try {
      await group.save();
      if (firstUser)
        return null;
      const msgClient: MsgToClient = {
        id: join.id,
        chat: id,
        user: { login: user.nick, image: user.imgUrl },
        date: join.date,
        msg: join.msg,
        type: join.type,
      };
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Error sabing group joinGroup');
    }
  }

  async leaveGroup(user_email: string, id: string): Promise<MsgToClient | null | undefined> {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const group = await this.findGroupById(id);
    if (!user || !group)
      throw new BadRequestException('Invalid Request joinGroup');

    if (group.users.map(e => e.email).indexOf(user_email) < 0)
      return undefined;

    const lastUser: boolean = group.users.length === 1;

    const leave = new Message();
    leave.sender = user;
    leave.date = new Date(Date.now());
    leave.msg = 'leaved the group';
    leave.type = 'action';

    group.users = group.users.filter((key) => key.email !== user.email);
    group.messages = group.messages.filter(key =>
      !(key.type === 'breakpoint' && key.sender.email === user_email));

    if (!lastUser)
      group.messages.push(leave);

    try {
      await group.save();
      if (lastUser) {
        await this.groupRepository.delete(group.id);
        return null;
      }
      const msgClient: MsgToClient = {
        id: leave.id,
        chat: id,
        user: { login: user.nick, image: user.imgUrl },
        date: leave.date,
        msg: leave.msg,
        type: leave.type,
      };
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Error sabing group joinGroup');
    }
  }

  async kickMember(user_email: string, removed_login: string, chat: string): Promise<MsgToClient | null> {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const removed = await this.userService.findUserGroupByNick(removed_login);
    const group = await this.findGroupById(chat);

    if (!group || !user || !removed)
      throw new InternalServerErrorException('Infos not found kickMember');

    if (user.nick !== group.owner.nick) // pensar o que fazer nessa porra desse trol aqui
      throw new UnauthorizedException('Permission denied');

    if (group.users.map(e => e.nick).indexOf(removed.nick) < 0)
      return null;

    if (user.nick === removed.nick)
      return null;

    const kick = new Message();
    kick.sender = removed;
    kick.date = new Date(Date.now());
    kick.msg = 'has been kicked the group';
    kick.type = 'action';

    group.users = group.users.filter((key) => key.nick !== removed.nick);
    group.messages = group.messages.filter(key =>
      !(key.type === 'breakpoint' && key.sender.nick === removed.nick));

    group.messages.push(kick);

    try {
      await group.save();
      const msgClient: MsgToClient = {
        id: kick.id,
        chat: chat,
        user: { login: removed.nick, image: removed.imgUrl },
        date: kick.date,
        msg: kick.msg,
        type: kick.type,
      };
      return msgClient;
    } catch (err) {
      throw new InternalServerErrorException('Error saving group joinGroup');
    }
  }

  async removeMember(user_email: string, removeMemberDto: RemoveMemberDto) {
    const user = await this.userService.findUserGroupByEmail(user_email);
    const group = await this.findGroupById(removeMemberDto.id);
    if (!group)
      throw new BadRequestException('Group not found joinGroup');

    if (!user || user.nick !== group.owner.nick)
      throw new UnauthorizedException('Permission denied');

    group.users = group.users.filter((key) => {
      if (key.nick === removeMemberDto.name)
        return;
      return key;
    });

    try {
      group.save();
    } catch (err) {
      throw new InternalServerErrorException('Error sabing group joinGroup');
    }
  }


  async sendGroupInvite(user_email: string, groupInviteDto: GroupInviteDto) {
    const user = await this.userService.findUserByEmail(user_email);
    const friend = await this.userService.findUserByNick(groupInviteDto.name);
    const group = await this.findGroupById(groupInviteDto.groupId);

    if (!friend || !user || !group)
      throw new InternalServerErrorException('User not found');
    // if (user && friend && user.nick === friend.nick) {
    //   throw new BadRequestException('You cant add yourself');
    // }

    // console.log('passou das validações')


    const newNotify = new Notify();
    newNotify.type = 'group';
    newNotify.user_source = user;
    newNotify.date = new Date(Date.now());
    newNotify.additional_info = group.id;

    if (friend.notify?.length === 0) {
      friend.notify = [];
    }

    const duplicated = friend.notify.filter((friendNotify) => {
      if (friendNotify.type == newNotify.type && friendNotify.user_source.nick == newNotify.user_source.nick)
        return friendNotify;
      return;
    });

    if (duplicated.length > 0)
      throw new BadRequestException('This user already your order');

    if (group.users.map(e => e.email).indexOf(friend.email) >= 0)
      throw new BadRequestException('This user already in group');

    if (this.userService.isBlocked(user, friend) || this.userService.isBlocked(friend, user))
      return;

    friend.notify?.push(newNotify);
    try {
      friend.save();
    } catch (err) {
      console.log(err);
    }
  }

  async addAdmin(user_email: string, groupInviteDto: GroupInviteDto) {
    const user = await this.userService.findUserByEmail(user_email);
    const friend = await this.userService.findUserByNick(groupInviteDto.name);
    const group = await this.findGroupById(groupInviteDto.groupId);

    if (!friend || !user || !group)
      throw new InternalServerErrorException('User not found');

    if (user.nick !== group.owner.nick)
      throw new UnauthorizedException('Permission denied');

    if (group.admins && group.admins.map(e => e.email).indexOf(friend.email) >= 0)
      throw new BadRequestException('This user already is admin');

    if (!group.admins || group.admins.length === 0)
      group.admins = [];

    group.admins.push(friend);

   
    try {
      group.save();
    } catch (err) {
      throw new InternalServerErrorException('error saving admin');
    }
  }

  async removeAdmin(user_email: string, groupInviteDto: GroupInviteDto) {
    const user = await this.userService.findUserByEmail(user_email);
    const friend = await this.userService.findUserByNick(groupInviteDto.name);
    const group = await this.findGroupById(groupInviteDto.groupId);

    if (!friend || !user || !group)
      throw new InternalServerErrorException('User not found');

    if (user.nick !== group.owner.nick)
      throw new UnauthorizedException('Permission denied');

    if (!group.admins || group.admins.length === 0)
      group.admins = [];

    if (group.admins.map(e => e.email).indexOf(friend.email) < 0)
      throw new BadRequestException('This user isnt admin');
   
    group.admins = group.admins.filter((user) => {
      if (user.email === friend.email)
        return;
      return user;
    });

    try {
      group.save();
    } catch (err) {
      throw new InternalServerErrorException('error saving admin');
    }
  }
}