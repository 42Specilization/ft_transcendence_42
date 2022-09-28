import { Injectable } from '@nestjs/common';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { IntraData } from 'src/auth/dto/IntraData.dto';
import { User } from './dto/user.dto';


@Injectable()
export class UserService {

  private users = new Map<string, User>();

  createUser(data: IntraData, token: AccessTokenResponse) {

    const user: User = {
      name: data.first_name,
      email: data.email,
      login: data.login,
      imgUrl: data.image_url,
      token: token.access_token
    };
    this.users.set(user.email, user);
    console.log('(CREATE USER)users aqui ', this.users);
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
