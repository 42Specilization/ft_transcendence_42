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
import { GetFriendDto } from './dto/get-friend.dto';
import { NotifyHandlerDto } from 'src/notification/dto/notify-dto';
import { generateCode, getAssetsPath } from 'src/utils/utils';
import { ChallengeRequestDto } from './dto/challenge-request.dto';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
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

    const sendedCode = generateCode();
    updateUserDto.tfaCode = sendedCode;
    const user = await this.userService.updateUser(updateUserDto, userFromJwt.email);
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: false,
      auth: {
        user: process.env['API_EMAIL_USER'],
        pass: process.env['API_EMAIL_PASS'],
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
    if (user.tfaEmail) {
      await transporter.sendMail({
        from: process.env['API_EMAIL_FROM'],
        to: [user.tfaEmail as string],
        subject: 'Verify Code from Transcendence',
        text: `Your validation code is '${sendedCode}'`,
        html: `
    <div style="width: 100%; height: 100%; font-family: 'Arial'">
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
  @Patch('updateNick')
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

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async getFriend(
    @Body() getProfileUserDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    return await this.userService.getProfileUser(userFromJwt.email, getProfileUserDto.nick);
  }

  /* This method is used to update the user's image. */
  @Post('updateImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
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

  /* This method is used to update the user's image. */
  @Post('uploadImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
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
  async getUserImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { message: 'success', path: file.path };
  }

  @Patch('sendFriendRequest')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Body(ValidationPipe) friendRequestDto: FriendRequestDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.sendFriendRequest(userFromJwt.email, friendRequestDto.nick);
    return { message: 'success' };
  }

  @Patch('sendChallengeRequest')
  @UseGuards(JwtAuthGuard)
  async sendChallengeRequest(
    @Body(ValidationPipe) challengeRequestDto: ChallengeRequestDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    const newNotify = await this.userService.sendChallengeRequest(userFromJwt.email, challengeRequestDto);
    return ({ message: 'success', notify: newNotify });
  }

  @Patch('removeNotify')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async removeNotify(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.popNotification(userFromJwt.email, notifyHandlerDto.id, notifyHandlerDto.notify);
    return { message: 'success' };
  }

  @Patch('acceptFriend')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async acceptFriend(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.acceptFriend(userFromJwt.email, notifyHandlerDto.id);
    return { message: 'success' };
  }

  @Patch('blockUserByNotification')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotifyHandlerDto })
  async blockUserByNotification(
    @Body(ValidationPipe) notifyHandlerDto: NotifyHandlerDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.blockUserByNotification(userFromJwt.email, notifyHandlerDto.id);
    return { message: 'success' };
  }

  @Patch('removeFriend')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async removeFriend(
    @Body(ValidationPipe) getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.removeFriend(userFromJwt.email, getFriendDto.nick);
    return { message: 'success' };
  }

  @Patch('addBlocked')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetFriendDto })
  async addBlocked(
    @Body(ValidationPipe) getFriendDto: GetFriendDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<{ message: string }> {
    await this.userService.addBlocked(userFromJwt.email, getFriendDto.nick);
    return { message: 'success' };
  }

  @Patch('removeBlocked')
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

  @Get('getFriends')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getFriends(@GetUserFromJwt() userFromJwt: UserFromJwt) {
    return (await this.userService.getFriends(userFromJwt.email));
  }

  @Get('getGlobalInfos')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getGlobalInfos(@GetUserFromJwt() userFromJwt: UserFromJwt) {
    return (await this.userService.getGlobalInfos(userFromJwt.email));
  }

}