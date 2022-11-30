import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommunityDto, UserDto } from './dto/user.dto';
import * as fs from 'fs';
import { GameEntity } from 'src/game/entities/game.entity';
import { Notify } from '../notification/entities/notify.entity';
import { Relations } from 'src/relations/entity/relations.entity';
// import { Chat } from 'src/chat/entities/chat.entity';
import { NewNotifyDto } from '../notification/dto/notify-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,

  ) { }

  async save(user: User) {
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('save: Error to save a user!');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, imgUrl, first_name, usual_full_name, nick, token } =
      createUserDto;
    const user = new User();
    user.email = email;
    user.imgUrl = !imgUrl ? 'userDefault.png' : imgUrl;
    user.first_name = first_name;
    user.usual_full_name = usual_full_name;
    user.nick = nick;
    user.token = await bcrypt.hash(token, 10);
    user.matches = '0';
    user.wins = '0';
    user.lose = '0';
    try {
      await this.usersRepository.save(user);
      user.token = '';
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('E-mail address already in use!');
      } else {
        throw new InternalServerErrorException(
          'createUser: Error to create a user!'
        );
      }
    }
  }

  incrementStat(stats: string): string {
    let newStats = Number(stats);
    newStats++;
    return (newStats.toString());
  }

  async saveNewGame(nick: string, game: GameEntity) {
    const user = await this.findUserByNickWithGames(nick);
    if (!user) {
      return;
    }
    if (!user.games) {
      user.games = [];
    }
    user.games.push(game);
    if (nick === game.winner.nick) {
      user.wins = this.incrementStat(user.wins);
    } else {
      user.lose = this.incrementStat(user.lose);
    }
    user.matches = this.incrementStat(user.matches);

    try {
      await this.usersRepository.save(user);
    } catch {
      throw new InternalServerErrorException('saveNewGame: Error to save a new game on db!');
    }
  }

  async findUserByNick(nick: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        nick,
      },
      relations: [
        'notify',
        'directs',
        'directs.users',

        'notify.user_source',
        'relations',
        'relations.passive_user',
      ],
    });
  }

  async findUserGamesByNick(nick: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        nick,
      },
      relations: [
        'games',
        'games.winner',
        'games.loser',
      ],
      order: {
        games: {
          createdAt: 'desc'
        }
      }
    });
  }

  async findUserByNickWithGames(nick: string): Promise<User | null> {
    return (await this.usersRepository.find({
      where: { nick },
      relations: {
        games: true
      }
    }))[0];
  }

  async getUsersWithGames(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: [
        'games',
        'games.loser',
        'games.winner',
      ]
    });
  }


  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          email,
        },
        relations: [
          'notify',
          'directs',
          'directs.users',
          'notify.user_source',
          'relations',
          'relations.passive_user',
        ]
      });
  }

  async findUserDirectByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          email,
        },
        relations: [
          'directs',
          'directs.users',
          'directs.messages',
          'directs.messages.sender',
          'relations',
          'relations.passive_user',
        ],
        order: {
          directs: {
            date: 'desc'
          }
        }
      });
  }

  async findUserDirectByNick(nick: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          nick,
        },
        relations: [
          'directs',
          'directs.users',
          'directs.messages',
          'directs.messages.sender',
          'relations',
          'relations.passive_user',
        ],
        order: {
          directs: {
            date: 'desc'
          }
        }
      });
  }

  async findUserGroupByNick(nick: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          nick,
        },
        relations: [
          'groups',
          'groups.users',
          'groups.messages',
          'groups.messages.sender',
          'relations',
          'relations.passive_user',
        ],
      });
  }

  async findUserGroupByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          email,
        },
        relations: [
          'groups',
          'groups.users',
          'groups.messages',
          'groups.messages.sender',
          'relations',
          'relations.passive_user',
        ],
      });
  }
  async findAllChats(nick: string): Promise<User | null> {
    return await this.usersRepository.findOne(
      {
        where: {
          nick,
        },
        relations: [
          'groups',
          'directs'
        ]

      });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },

    });
    if (!user) throw new NotFoundException('User Not Found FindUserByID');
    return user;
  }

  async checkDuplicateNick(nick: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        nick,
      },
    });
    if (user) return true;
    return false;
  }

  async updateToken(email: string, token: AccessTokenResponse) {
    const user = (await this.findUserByEmail(email)) as User;
    user.token = token.access_token;
    user.tfaValidated = false;
    try {
      user.save();
    } catch {
      throw new InternalServerErrorException(
        'UpdateToken: Error to update token!'
      );
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserDTO(email: string): Promise<UserDto> {
    const user = (await this.findUserByEmail(email)) as User;
    const userDto: UserDto = {
      email: user.email,
      first_name: user.first_name,
      image_url: user.imgUrl,
      login: user.nick,
      usual_full_name: user.usual_full_name,
      matches: user.matches,
      wins: user.wins,
      lose: user.lose,
      isTFAEnable: user.isTFAEnable as boolean,
      tfaValidated: user.tfaValidated as boolean,
      notify: user.notify.map((notify) => {
        return {
          id: notify.id,
          type: notify.type,
          user_source: notify.user_source?.nick,
          additional_info: notify.additional_info,
          date: notify.date,
        };
      }),

      friends: user.relations.filter((rel) => rel.type === 'friend').map((rel) => {
        return {
          status: 'offline',
          login: rel.passive_user.nick,
          image_url: rel.passive_user.imgUrl,
        };
      }),

      blockeds: user.relations.filter((rel) => rel.type === 'blocked')
        .map((rel) => {
          return {
            login: rel.passive_user.nick,
            image_url: rel.passive_user.imgUrl,
          };
        }),
    };
    return userDto;
  }

  async getUser(email: string): Promise<User> {
    const user = (await this.findUserByEmail(email)) as User;
    return user;
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User | null> {
    const { email, token } = credentialsDto;

    const user = await this.usersRepository.findOneBy({ email });
    if (user && (await user.checkToken(token))) {
      return user;
    } else {
      return null;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, email: string): Promise<User> {
    const user = (await this.findUserByEmail(email)) as User;
    const { nick, imgUrl, isTFAEnable, tfaEmail, tfaValidated, tfaCode } = updateUserDto;
    if (nick && (await this.checkDuplicateNick(nick)))
      throw new ForbiddenException('Duplicated nickname');
    user.nick = nick ? nick : user?.nick;
    user.isTFAEnable =
      isTFAEnable !== undefined ? isTFAEnable : user.isTFAEnable;
    user.tfaEmail = tfaEmail ? tfaEmail : user?.tfaEmail;
    user.tfaValidated =
      tfaValidated !== undefined ? tfaValidated : user.tfaValidated;
    user.tfaCode = tfaCode ? bcrypt.hashSync(tfaCode, 8) : user.tfaCode;
    if (imgUrl) {
      if (user.imgUrl !== 'userDefault.png'
        && !user.imgUrl.includes('https://')) {
        fs.rm(
          `../web/public/${user.imgUrl}`,
          function (err) {
            if (err) throw err;
          }
        );
      }
      user.imgUrl = imgUrl;
    }

    if (tfaCode == null) {
      user.tfaCode = '';
    }

    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error saving user update');
    }
  }


  isBlocked(user_passive: User, user_active: User) {

    const blocked = user_active.relations.filter((friendRelation) => {
      if (friendRelation.type == 'blocked' && friendRelation.passive_user.nick == user_passive.nick)
        return friendRelation;
      return;
    });

    if (blocked.length > 0)
      return true;
    return false;
  }

  alreadyFriends(user: User, friend: User) {
    const alreadyFriends = friend.relations.filter((relation) => {
      if (relation.type === 'friend'
        && relation.passive_user.nick == user.nick)
        return relation;
      return;
    });

    if (alreadyFriends.length > 0)
      return true;
    return false;
  }


  /**
   * It sends a friend request to a user
   * @param {string} user_email - string - the email of the user who sent the request
   * @param {string} user_target - string - the nickname of the user to whom we send the request
   */
  async sendFriendRequest(user_email: string, user_target: string) {
    const user = await this.findUserByEmail(user_email);
    const friend = await this.findUserByNick(user_target);
    if (!friend || !user)
      throw new InternalServerErrorException('User not found');
    if (user && friend && user.nick === friend.nick) {
      throw new BadRequestException('You cant add yourself');
    }

    const newNotify = new Notify();
    newNotify.type = 'friend';
    newNotify.user_source = user;
    newNotify.date = new Date(Date.now());
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

    const alreadyFriends = this.alreadyFriends(user, friend);
    if (alreadyFriends)
      throw new BadRequestException('This user already is your friend');


    if (this.isBlocked(user, friend) || this.isBlocked(friend, user))
      return;

    friend.notify?.push(newNotify);
    try {
      friend.save();
    } catch (err) {
      console.log(err);
    }
  }

  /**
* It finds a user by email, filters out the notification with the given id, and saves the user
* @param {string} email - string - The email of the user you want to find.
* @param {string} id - the id of the notification
* @returns The user is being returned.
*/
  async popNotification(email: string, id: string) {
    const user = await this.findUserByEmail(email) as User;
    user.notify = user.notify.filter((notify) => {
      if (notify.id == id)
        return;
      return notify;
    });
    try {
      await user.save();
      return;
    } catch (err) {
      throw new InternalServerErrorException('Error saving notify');
    }
  }

  /**
 * It accepts a friend request
 * @param {string} email - string - the email of the user who will accept the friend request
 * @param {string} id - the id of the notification
 * @returns nothing.
 */
  async acceptFriend(email: string, id: string) {
    const user = await this.findUserByEmail(email) as User;
    const requestedNotify: Notify[] = user.notify.filter((notify) => notify.id === id);

    if (!requestedNotify.at(0))
      throw new BadRequestException('friend not found');

    console.log('apagou a notificaçao');
    const friend = await this.findUserByEmail(requestedNotify.at(0)?.user_source.email as string) as User;
    const alreadyFriends = this.alreadyFriends(user, friend);
    if (alreadyFriends) {
      this.popNotification(email, id);
      throw new BadRequestException('This user already is your friend');
    }

    const relationUser = new Relations();
    const relationFriend = new Relations();
    relationUser.passive_user = friend;
    relationUser.type = 'friend';
    relationFriend.passive_user = user;
    relationFriend.type = 'friend';
    user.relations.push(relationUser);
    friend.relations.push(relationFriend);

    try {
      await user.save();
      await friend.save();
      await this.popNotification(email, id);
      return;
    } catch (err) {
      throw new InternalServerErrorException('Error saving notify accept');
    }
  }

  /**
 * It receives an email and an id, finds the user by email, finds the notification by id, finds the
 * user who sent the notification, creates a new relation, adds the relation to the user's relations,
 * saves the user, and pops the notification
 * @param {string} email - string, id: string
 * @param {string} id - the id of the notification
 * @returns The user is being returned.
 */
  async blockUserByNotification(email: string, id: string) {
    const user = await this.findUserByEmail(email) as User;

    const requestedNotify: Notify[] = user.notify.filter((notify) => notify.id === id);

    if (!requestedNotify.at(0))
      throw new BadRequestException('friend not found');

    const blocked = await this.findUserByEmail(requestedNotify.at(0)?.user_source.email as string) as User;

    const relationUser = new Relations();

    relationUser.passive_user = blocked;
    relationUser.type = 'blocked';

    user.relations.push(relationUser);

    try {
      await user.save();
      await this.popNotification(email, id);
      return;
    } catch (err) {
      throw new InternalServerErrorException('Error saving notify block ');
    }
  }


  /**
 * It removes a friend from the user's friend list and vice-versa
 * @param {string} email - string, friend_login: string
 * @param {string} friend_login - string - the login of the user you want to add as a friend
 * @returns The user's friends
 */
  async removeFriend(email: string, friend_login: string) {
    const user = await this.findUserByEmail(email) as User;

    const friend = await this.findUserByNick(friend_login) as User;

    user.relations = user.relations.filter((relation) => {
      if (relation.type === 'friend' && relation.passive_user.nick == friend.nick)
        return;
      return relation;
    });

    friend.relations = friend.relations.filter((relation) => {
      if (relation.type === 'friend' && relation.passive_user.nick == user.nick)
        return;
      return relation;
    });

    try {
      await user.save();
      await friend.save();
      return;
    } catch (err) {
      throw new InternalServerErrorException('Error saving notify remove');
    }
  }

  /**
 * It removes a friend from the user's friend list and adds the friend to the user's blocked list
 * @param {string} email - string, friend_login: string
 * @param {string} friend_login - string
 * @returns the user object.
 */
  async addBlocked(email: string, friend_login: string) {
    const user = await this.findUserByEmail(email) as User;

    const friend = await this.findUserByNick(friend_login) as User;

    user.relations = user.relations.filter((relation) => {
      if (relation.type === 'friend' && relation.passive_user.nick == friend.nick)
        return;
      return relation;
    });

    friend.relations = friend.relations.filter((relation) => {
      if (relation.type === 'friend' && relation.passive_user.nick == user.nick)
        return;
      return relation;
    });


    const relationUser = new Relations();

    relationUser.passive_user = friend;
    relationUser.type = 'blocked';

    user.relations.push(relationUser);

    try {
      await user.save();
      await friend.save();
      return;
    } catch (err) {
      throw new InternalServerErrorException('Error saving notify new blocked');
    }
  }

  /**
 * It removes a blocked user from the user's blocked list
 * @param {string} email - string - the email of the user who is blocking the other user
 * @param {string} friend_login - the login of the user you want to unblock
 * @returns The user's relations array is being filtered to remove the blocked relation.
 */
  async removeBlocked(email: string, friend_login: string) {
    const user = await this.findUserByEmail(email) as User;

    user.relations = user.relations.filter((relation) => {
      if (relation.type === 'blocked' && relation.passive_user.nick == friend_login)
        return;
      return relation;
    });

    try {
      await user.save();
      return;
    } catch (err) {
      throw new InternalServerErrorException('erro salvando notificacao');
    }
  }

  async getCommunty(user_email: string) {
    const users = await this.usersRepository.find();
    const usersToReturn: CommunityDto[] = users.filter((user) => {
      if (user.email === user_email)
        return;
      return user;
    }).map((user) => {
      return {
        image_url: user.imgUrl,
        login: user.nick,
        ratio: ((
          Number(user.wins) /
          (Number(user.lose) > 0 ? Number(user.lose) : 1)
        ).toFixed(2)).toString()
      };
    }).sort((a, b) => {
      if (a.ratio > b.ratio)
        return -1;
      return 1;
    });
    return usersToReturn;
  }


  async getHistoric(login: string) {
    const userValidate = await this.findUserGamesByNick(login);
    if (userValidate) {
      const userData = userValidate.games
        .map((game) => {
          let opponent;
          let result;
          if (game.winner.nick != login) {
            result = `Lose ${game.winnerScore}x${game.loserScore}`;
            opponent = game.winner;
          } else {
            result = `Win ${game.winnerScore}x${game.loserScore}`;
            opponent = game.loser;
          }
          return {
            date: game.createdAt,
            opponent: {
              imgUrl: opponent.imgUrl,
              login: opponent.nick,
            },
            result: result,
          };
        });
      console.log(userData);
      return (userData);
    }
    throw new BadRequestException('user not found');
  }

  async notifyMessage(user_email: string, receivedNotify: NewNotifyDto) {
    const user = await this.findUserByEmail(user_email);
    const target = await this.findUserByNick(receivedNotify.target);
    if (!user || !target)
      throw new BadRequestException('User not found notifyMessage');


    const newNotify = new Notify();
    newNotify.type = 'message';
    newNotify.user_source = user;
    newNotify.additional_info = receivedNotify.add_info;
    newNotify.date = new Date(Date.now());
    if (target.notify?.length === 0) {
      target.notify = [];
    }

    target.notify = target.notify.filter((notify) => {
      if (notify.type === 'message')
        return;
      return notify;
    });
    target.notify?.push(newNotify);

    try {
      await target.save();
    } catch (err) {
      throw new InternalServerErrorException('Error saving datas in db notifyMessage');
    }
  }

}