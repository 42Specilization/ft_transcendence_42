import {
  Body, Controller, Get, Patch,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { DirectDto, GetDirectDto } from './dto/chat.dto';

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


}
