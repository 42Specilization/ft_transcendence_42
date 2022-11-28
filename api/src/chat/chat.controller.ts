import {
  Body, Controller, Get, Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { DirectDto, GetDirectDto, DeleteDirectDto, CreateGroupDto } from './dto/chat.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {

  }

  @Get('/getAllDirects')
  @UseGuards(JwtAuthGuard)
  async getDirects(@GetUserFromJwt() userFromJwt: UserFromJwt): Promise<DirectDto[] | null> {
    const result = await this.chatService.getAllDirects(userFromJwt.email);
    return result;
  }

  @Patch('/getDirect')
  @UseGuards(JwtAuthGuard)
  async getDirect(
    @Body() getDirectDto: GetDirectDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<DirectDto> {
    return await this.chatService.getDirect(userFromJwt.email, getDirectDto.id);
  }


  @Patch('/getFriendDirect')
  @UseGuards(JwtAuthGuard)
  async getFriendChat(
    @Body() getDirectDto: GetDirectDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    return await this.chatService.getFriendDirect(userFromJwt.email, getDirectDto.id);
  }

  @Patch('/setBreakpoint')
  @UseGuards(JwtAuthGuard)
  async setBreakpoint(
    @Body() { chatId, type }: { chatId: string, type: string },
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    return await this.chatService.setBreakpointController(userFromJwt.email, chatId, type);
  }


  @Get('/devGetDirects')
  async devGetDirects() {
    const result = await this.chatService.getAllChats();
    return result;
  }

  @Patch('/deleteDirect')
  @UseGuards(JwtAuthGuard)
  async devDeleteDirectById(
    @Body() deleteDirectDto: DeleteDirectDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    console.log(deleteDirectDto.friend_login);
    await this.chatService.deleteDirectById(userFromJwt.email, deleteDirectDto.friend_login);
    return { message: 'success' };
  }


  @Post('/updateGroupImage')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // Destination storage path details
      destination: (req, file, cb) => {
        const uploadPath = './data';
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
    // @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    // const updateUserDto: UpdateUserDto = { imgUrl: file.originalname };
    // this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'success', path: file.path };
  }


  @Post('/createGroup')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    // @GetUserFromJwt() userFromJwt: UserFromJwt
  ) {
    console.log(createGroupDto);
    if (createGroupDto.password !== createGroupDto.confirmPassword)
      throw new BadRequestException('Passwords must be equals');

    // const updateUserDto: UpdateUserDto = { imgUrl: file.originalname };
    // this.userService.updateUser(updateUserDto, userFromJwt.email);
    return { message: 'success' };
  }



}
