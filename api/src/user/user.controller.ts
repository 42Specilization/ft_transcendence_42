import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
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

  @Patch('/updateNick/:id')
  async updateNick(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Param('id')id : string,

  ) {
    const user = await this.userService.findUserById(id);
    if (user.id != id) {
      throw new ForbiddenException('you do not have permission to change this user');
    } else {
      return this.userService.updateUser(updateUserDto, id);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return (await this.userService.getUsers());
  }

}
