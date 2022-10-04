import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AppDataSource } from './user.index';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return (this.userRepository.createUser(createUserDto));
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const repositoryUser = AppDataSource.getRepository(User);
    return (await repositoryUser.findOneBy({ email }));
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
    const repositoryUser = AppDataSource.getRepository(User);
    return (await repositoryUser.find());
  }

}
