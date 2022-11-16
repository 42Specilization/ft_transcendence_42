import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  userService: any;

  constructor (private readonly chatService: ChatService) {
    
  }

  @Post('/chat')
  @HttpCode(HttpStatus.CREATED)
  createChat(): { msg: string } {
    this.chatService;
    this.userService.createChat();
    return ({
      msg: 'success'
    });
  }


}
