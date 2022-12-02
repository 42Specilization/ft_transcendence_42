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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import * as nodemailer from 'nodemailer';
import { smtpConfig } from '../config/smtp';
import { UserDto, UserHistoricDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { FriendRequestDto } from './dto/friend-request.dto';
// import axios from 'axios';
import { GetFriendDto } from './dto/get-friend.dto';
import { NewNotifyDto, NotifyHandlerDto } from 'src/notification/dto/notify-dto';
import { getAssetsPath } from 'src/utils/utils';
import { ChallengeRequestDto } from './dto/challenge-request.dto';
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
    await this.userService.getUserDTO(userFromJwt.email);
    await this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'success' };
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
  async getFriend(
    @Body() getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    return await this.userService.getFriend(userFromJwt.email, getFriendDto.nick);
  }

  /* This method is used to update the user's image. */
  @Post('/updateImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // Destination storage path details
      destination: (req, file, cb) => {
        const uploadPath = getAssetsPath();
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
    return { message: 'success', path: file.path };
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

  @Patch('/sendChallengeRequest')
  @UseGuards(JwtAuthGuard)
  async sendChallengeRequest(
    @Body(ValidationPipe) challengeRequestDto: ChallengeRequestDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: 'success' }> {
    await this.userService.sendChallengeRequest(userFromJwt.email, challengeRequestDto);
    return ({ message: 'success' });
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

  @Patch('historic')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UserHistoricDto })
  async getHistoric(@Body() userHistoricDto: UserHistoricDto) {
    return await this.userService.getHistoric(userHistoricDto.login);
  }

  @Get('getCommunity')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getCommunity(@GetUserFromJwt() userFromJwt: UserFromJwt) {
    return (await this.userService.getCommunity(userFromJwt.email));
  }

  @Patch('/notifyMessage')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NewNotifyDto })
  async notifyMessage(
    @Body(ValidationPipe) newNotifyDto: NewNotifyDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.notifyMessage(userFromJwt.email, newNotifyDto);
    return { message: 'success' };
  }
}