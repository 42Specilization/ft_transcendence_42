import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, UseInterceptors, UploadedFile, ValidationPipe, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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
import * as nodemailer from 'nodemailer';
import { smtpConfig } from '../config/smtp';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';


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

  @Patch('/turn-on-tfa')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  async turnOnTfa(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    return this.userService.updateUser(updateUserDto, userFromJwt.email);
  }

  @Patch('/turn-off-tfa')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  async turnOffTfa(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    console.log('updateUser cancelando', updateUserDto);
    this.userService.updateUser(updateUserDto, userFromJwt.email);

    return { message: 'turned off' };
  }

  @Patch('/validate-code')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  async validateTFACode(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    console.log(updateUserDto);
    updateUserDto;
    userFromJwt;
    const user = await this.userService.getUser(userFromJwt.email);
    if (!bcrypt.compareSync(updateUserDto.tfaCode as string, user.tfaCode as string)){
      throw new UnauthorizedException('Invalid Code');
    }
    return ({
      msg: 'success'
    });

  }

  @Patch('/validate-email')
  @UseGuards(JwtAuthGuard)
  async validateEmailTFA(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    function generateCode(){
      let code = '';
      const avaliableChar = '1234567890';
      for (let i = 0; i < 6; i++){
        code += avaliableChar.charAt(Math.floor(Math.random() * avaliableChar.length));
      }
      return code;
    }

    const sendedCode = generateCode();
    updateUserDto.tfaCode = sendedCode;
    console.log('updateUser', updateUserDto);
    const user = await this.userService.updateUser(updateUserDto, userFromJwt.email);
    console.log('user', user);
    console.log('print do codigo enviado do tfa', sendedCode);

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: false,
      auth: {
        user: process.env['TFA_EMAIL_USER'],
        pass: process.env['TFA_EMAIL_PASS'],
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
    if (user.tfaEmail) {
      const mailSent =  await transporter.sendMail({
        text: `Your validation code is ${sendedCode}`,
        subject: 'Verify Code from Transcendence',
        from:process.env['TFA_EMAIL_FROM'],
        to: [user.tfaEmail as string]
      });
      mailSent;
    } else {
      throw new InternalServerErrorException('Error: Mail can\'t be empty');
    }
  }

  @Patch('/updateNick/')
  @UseGuards(JwtAuthGuard)
  async updateNick(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt : UserFromJwt,
  ) {
    await this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'succes' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return (await this.userService.getUsers());
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUser( @GetUserFromJwt() userFromJwt : UserFromJwt): Promise<UserDto> {
    return (await this.userService.getUserDTO(userFromJwt.email));
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
  async getFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUserFromJwt() userFromJwt : UserFromJwt
  ) {
    const updateUserDto: UpdateUserDto = {imgUrl: file.originalname};
    await this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'succes', path: file.path};
  }

}
