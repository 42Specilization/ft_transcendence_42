import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, UseInterceptors, UploadedFile, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @Patch('/updateNick/')
  @UseGuards(JwtAuthGuard)
  async updateNick(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    return this.userService.updateUser(updateUserDto, userFromJwt.email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return (await this.userService.getUsers());
  }

  @Post('/updateImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // Destination storage path details
      destination: (req, file, cb) => {
        const uploadPath ='../web/public';
        req;
        file;
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        req;
        file;
        cb(null, file.originalname);
      },
    }),
  }))
  getFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUserFromJwt() userFromJwt : UserFromJwt
  ) {
    const updateUserDto: UpdateUserDto = {imgUrl: file.originalname};
    console.log(file);
    this.userService.updateUser(updateUserDto,userFromJwt.email);
    return { message: 'succes', path: file.path};
  }

}
