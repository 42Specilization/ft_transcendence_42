import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
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
import { FriendRequestDto } from './dto/friend-request.dto';
// import axios from 'axios';
import { GetFriendDto } from './dto/get-friend.dto';
import { NotifyHandlerDto } from 'src/notification/dto/notify-dto';
// import { NotificationService } from 'src/notification/notification.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly notificationService: NotificationService
  ) { }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): { msg: string } {
    this.userService.createUser(createUserDto);
    return ({
      msg: 'success'
    });
  }

  /* A patch method that is used to turn on the two factor authentication. */
  @Patch('/turn-on-tfa')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  async turnOnTfa(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt,
  ) {
    await this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'turned on' };
  }

  /* A patch method that is used to turn off the two factor authentication. */
  @Patch('/turn-off-tfa')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  async turnOffTfa(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt,
  ) {
    this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'turned off' };
  }

  /* This method is used to validate the code that the user has sent. */
  @Patch('/validate-code')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  async validateTFACode(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt,
  ) {
    const user = await this.userService.getUser(userFromJwt.email);
    if (!bcrypt.compareSync(updateUserDto.tfaCode as string, user.tfaCode as string)) {
      throw new UnauthorizedException('Invalid Code');
    }
    return ({
      msg: 'success'
    });
  }

  /* Sending a email to the user with a code to validate the email. */
  @Patch('/validate-email')
  @UseGuards(JwtAuthGuard)
  async validateEmailTFA(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt,
  ) {

    function generateCode() {
      let code = '';
      const avaliableChar = '1234567890abcdefghijklmnopqrstuvwxyz';
      for (let i = 0; i < 6; i++) {
        code += avaliableChar.charAt(Math.floor(Math.random() * avaliableChar.length));
      }
      return code;
    }
    // returnHTML(username: string, code: string) {
    //   return (`<!DOCTYPE html>

    //   <html lang="en">
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>TFA Code</title>
    //     </head>
    //     <body>
    //       <h3>Hello, ${username}</h3>
    //       <p>You have requested to enable Two-Factor Authentication</p>
    //       <p>Your activation code is:</p>
    //       <div>
    //         <strong>${code}</strong>
    //       </div>
    //     </body>
    //   </html>

    //   <style>

    //   * {
    //     margin: 0;
    //     padding: 0;
    //     border: none;
    //     outline: none;
    //     text-decoration: none;
    //     list-style-type: none;
    //     box-sizing: border-box;
    //     background-color: transparent;
    //     font-family: 'Arial';
    //   }

    //   html {
    //     width: 100%;
    //     height: 100%;
    //   }

    //   body {
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     flex-direction: column;
    //     width: 100%;
    //     height: 100%;
    //   }

    //   h3 {
    //     font-size: 30px;
    //     margin: 50px;
    //   }

    //   p {
    //     font-size: 25px;
    //     margin:10px
    //   }

    //   div {
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     width:250px;
    //     height: 70px;
    //     color: white;
    //     margin:30px;
    //     font-size: 50px;
    //     background-color: #7C1CED;
    //     border-radius: 20px;
    //   }

    //   </style>`);
    // }
    const sendedCode = generateCode();
    updateUserDto.tfaCode = sendedCode;
    const user = await this.userService.updateUser(updateUserDto, userFromJwt.email);
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
      await transporter.sendMail({
        from: process.env['TFA_EMAIL_FROM'],
        to: [user.tfaEmail as string],
        subject: 'Verify Code from Transcendence',
        text: `Your validation code is '${sendedCode}'`,
        html: `
    <div style="width: 100%; heigth: 100%; font-family: 'Arial'">
      <h3 style="font-size: 30px; margin: 30px; color: black;">
        Hello, ${user.nick}
      </h3>
      <p style="font-size: 25px; margin: 40px auto; color: black; width:627px">
        You have requested to enable Two-Factor Authentication
      </p>
      <p style="font-size: 25px; margin: 20px auto; color: black; width:257px">
        Your activation code is:
      </p>
      <div style="color: white; font-size: 50px; font-weight: bold;
                  margin-top: 40px; padding: 10px 42% 10px;
                  border-radius: 20px; background-color: #7C1CED">
        ${sendedCode}
      </div>
    </div>
        `,
      });
    } else {
      throw new InternalServerErrorException('Error: Mail can\'t be empty');
    }
  }

  /* A method that is used to update the user's nickname. */
  @Patch('/updateNick/')
  @UseGuards(JwtAuthGuard)
  async updateNick(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt,
  ) {
    // const user =
    await this.userService.getUserDTO(userFromJwt.email);
    await this.userService.updateUser(updateUserDto, userFromJwt.email);
    // await this.notificationService.updateNotificationLogin(user.login, updateUserDto.nick as string);
    return { message: 'success' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return (await this.userService.getUsers());
  }

  /* This method is used to get the user's information. */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUser(@GetUserFromJwt() userFromJwt: UserFromJwt): Promise<UserDto> {
    return (await this.userService.getUserDTO(userFromJwt.email));
  }

  @Patch('friend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async getfriend(@Body() getFriendDto: GetFriendDto) {
    const userValidate = await this.userService.findUserByNick(getFriendDto.nick);
    if (userValidate) {
      const friendData = {
        image_url: userValidate.imgUrl,
        login: userValidate.nick,
        matches: userValidate.matches,
        wins: userValidate.wins,
        lose: userValidate.lose,
        name: userValidate.usual_full_name,
      };
      return (friendData);
    }
    throw new BadRequestException('friend not found');

  }

  /* This method is used to update the user's image. */
  @Post('/updateImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // Destination storage path details
      destination: (req, file, cb) => {
        const uploadPath = '../web/public';
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
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    const updateUserDto: UpdateUserDto = { imgUrl: file.originalname };
    this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'succes', path: file.path };
  }

  @Patch('/sendFriendRequest')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Body(ValidationPipe) friendRequestDto: FriendRequestDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.sendFriendRequest(userFromJwt.email, friendRequestDto.nick);
    return { message: 'success' };
  }

  @Patch('/removeNotify')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async removeNotify(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.popNotification(userFromJwt.email, notifyHandlerDto.id);
    return { message: 'success' };
  }

  @Patch('/acceptFriend')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async acceptFriend(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.acceptFriend(userFromJwt.email, notifyHandlerDto.id);
    return { message: 'success' };
  }

  @Patch('/blockUserByNotification')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async blockUserByNotification(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.blockUserByNotification(userFromJwt.email, notifyHandlerDto.id);
    return { message: 'success' };
  }

  @Patch('/removeFriend')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async removeFriend(
    @Body(ValidationPipe) getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.removeFriend(userFromJwt.email, getFriendDto.nick);
    return { message: 'success' };
  }

  @Patch('/addBlocked')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async addBlocked(
    @Body(ValidationPipe) getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.addBlocked(userFromJwt.email, getFriendDto.nick);
    return { message: 'success' };
  }

  @Patch('/removeBlocked')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async removeBlocked(
    @Body(ValidationPipe) getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.removeBlocked(userFromJwt.email, getFriendDto.nick);
    return { message: 'success' };
  }



  // @Post('/chat')
  // @ApiBody({ type: CreateDirectDto })
  // @HttpCode(HttpStatus.CREATED)
  // createChat(): { msg: string } {
  //   // this.userService.createChat();
  //   return ({
  //     msg: 'success'
  //   });
  // }

  @Get('games')
  @HttpCode(HttpStatus.OK)
  async getUsersWithGames(): Promise<User[]> {
    return (await this.userService.getUsersWithGames());
  }

}
