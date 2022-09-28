import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get()
  getUsers(): Map<string, User> {
    const users = this.userService.getUsers();
    console.log('OPA GET USERS AQ', users);
    return (users);
  }

}
