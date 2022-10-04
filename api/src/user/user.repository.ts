import { AppDataSource } from './user.index';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';

@Injectable()
export class UserRepository {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, imgUrl, first_name, usual_full_name, nick, token } = createUserDto;

    const user = new User();
    user.email = email;
    user.imgUrl = imgUrl;
    user.first_name = first_name;
    user.usual_full_name = usual_full_name;
    user.nick = nick;
    user.token = await bcrypt.hash(token, 10);

    try {
      const repositoryUser = AppDataSource.getRepository(User);
      await repositoryUser.save(user);
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

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User | null> {
    const { email, token } = credentialsDto;

    const repositoryUser = AppDataSource.getRepository(User);
    const user = await repositoryUser.findOneBy({ email });
    if (user && (await user.checkToken(token))) {
      return (user);
    } else {
      return (null);
    }
  }


}