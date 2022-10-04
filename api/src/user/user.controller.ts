import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): { msg: string } {
    this.userService.createUser(createUserDto);
    return ({
      msg: 'success'
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(): { [k: string]: User; } {
    const users = this.userService.getUsers();
    return (Object.fromEntries(users));
  }

}
