import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, imgUrl, first_name, usual_full_name, nick, token } = createUserDto;

    const user = new User();
    user.email = email;
    user.imgUrl = !imgUrl  ? 'https://e7.pngegg.com/pngimages/498/183/png-clipart-homer-simpson-homer-simpson-eating-a-donut-at-the-movies-cartoons-thumbnail.png' : imgUrl;
    user.first_name = first_name;
    user.usual_full_name = usual_full_name;
    user.nick = nick;
    user.token = await bcrypt.hash(token, 10);

    try {
      await this.usersRepository.save(user);
      user.token = '';
      return (user);
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('E-mail address already in use!');
      } else {
        throw new InternalServerErrorException('createUser: Error to create a user!');
      }

    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return (await this.usersRepository.findOneBy({ email }));
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

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
    const user = await this.findUserByEmail(email) as User;
    user.token = token.access_token;
    try {
      user.save();
    } catch {
      throw new InternalServerErrorException('UpdateToken: Error to update token!');
    }
  }

  async getUsers(): Promise<User[]> {
    return (await this.usersRepository.find());
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User | null> {
    const { email, token } = credentialsDto;

    const user = await this.usersRepository.findOneBy({ email });
    if (user && (await user.checkToken(token))) {
      return (user);
    } else {
      return (null);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, email: string) : Promise<User> {
    const user = await this.findUserByEmail(email) as User;
    const { nick, imgUrl } = updateUserDto;
    if (await this.checkDuplicateNick(nick))
      throw new ForbiddenException('Duplicated nickname');

    if (nick.length > 15)
      throw new BadRequestException('Invalid Length');

    user.nick = nick ? nick : user?.nick;
    user.imgUrl = imgUrl ? imgUrl : user?.imgUrl;
    try {
      await user.save();
      return user;

    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar os dados no db');
    }
  }


}
