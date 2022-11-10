import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { GetUserFromJwt } from 'src/auth/decorators/get-user.decorator';
import { UserFromJwt } from 'src/auth/dto/UserFromJwt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetUserNotificationsDto } from './dto/get-user-notifications.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { console.log(this.notificationService);}

  // Colocar auth nessas rotas
  // Nao coloquei pra conseguir desenvolver sem o front
  @Post('/createNotify')
  @ApiBody({ type: CreateNotificationDto })
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<{ msg: string }>{
    const response = await this.notificationService.createNotification(createNotificationDto);
    if (response) {
      return ({
        msg: 'success'
      });
    }
    throw new BadRequestException('Failed creating notification');
  }
  
  @ApiBody({ type: GetUserNotificationsDto })
  @UseGuards(JwtAuthGuard)
  @Patch('/userNotifications')
  async getUserNotification(
    @Body() getUserNotificationDto: GetUserNotificationsDto,
    @GetUserFromJwt() userFromJwt: UserFromJwt
  ){
    try {
      // console.log(getUserNotificationDto);
      const friend =  await axios.patch(`http://${process.env['HOST']}:${process.env['PORT']}/user/friend`, {email: getUserNotificationDto.user_email}); 
      // console.log('friend', friend.data);
      const notifications = await this.notificationService.findNotificationByDestinationId(friend.data.id);
      if (notifications) {
        
        for (const notify of notifications) {
          const requester =  await axios.patch(`http://${process.env['HOST']}:${process.env['PORT']}/user/friend`, {email: userFromJwt.email}); 
          notify.destination_id = friend.data.nick;
          notify.send_id = requester.data.nick;
        }
      }
      return notifications;
    } catch (err){
      console.log (err);
    }
    return ;
  }
}
