import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { DirectChat, DirectDto, GetDirectDto } from './dto/chat.dto';
import { CreateDirectDto } from './dto/create-direct.dto';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor (private readonly chatService: ChatService) {
    
  }

  @Post('/createDirect')
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateDirectDto })
  createDirect(@Body()  createDirectDto:CreateDirectDto ): { msg: string } {
    this.chatService.createDirect('gsilva-v@student.42sp.org.br', createDirectDto);
    return ({
      msg: 'success'
    });
  }

  @Get('/getDirects')
  @UseGuards(JwtAuthGuard)
  async getDirects(@GetUserFromJwt() userFromJwt: UserFromJwt): Promise<DirectDto[] | null> {
    return await this.chatService.getDirects(userFromJwt.email);
  }

  @Patch('/getDirect')
  @UseGuards(JwtAuthGuard)
  async getDirect(
    @Body()  getDirectDto :GetDirectDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ): Promise<DirectChat> {
    // console.log('id getDirect', getDirectDto.id);
    return await this.chatService.getDirect(userFromJwt.email, getDirectDto.id);
  }


}
