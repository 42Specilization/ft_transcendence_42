import { Injectable } from '@nestjs/common';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { IntraData } from 'src/auth/dto/IntraData.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository) { }

  private users = new Map<string, User>();

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return (this.userRepository.createUser(createUserDto));
  }

  getUser(email: string): User | undefined {
    const user = this.users.get(email);
    return (user);
  }

  getUsers(): Map<string, User> {
    return (this.users);
  }

  updateToken(email: string, token: AccessTokenResponse) {
    this.users.set(email, { ...this.users.get(email) as User, token: token.access_token });
  }

}
