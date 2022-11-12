import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>
  ) { console.log(this.notificationRepository); }


  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification | null> {
    const { destination_nick, type, sender_nick } = createNotificationDto;
    const notification = new Notification();
    if (type !== 'friend' && type !== 'challenge' && type !== 'message') {
      return null;
    }
    notification.destination_nick = destination_nick;
    notification.type = type;
    notification.sender_nick = sender_nick;
    try {
      await this.notificationRepository.save(notification);
      return notification;
    } catch (error) {
      throw new InternalServerErrorException(
        'createUser: Error to create a user!');
    }

  }

  async findNotificationByDestinationNick(destination_nick: string): Promise<Notification[] | null> {
    return await this.notificationRepository.findBy({ destination_nick });
  }
  
  async updateNotificationLogin(oldLogin: string, newLogin: string) {
    const notifications = await this.notificationRepository.find({
      where:[
        { destination_nick: oldLogin },
        { sender_nick: oldLogin }
      ]});
    notifications.map(obj => {
      if (obj.destination_nick === oldLogin)
        obj.destination_nick = newLogin;
      else 
        obj.sender_nick = newLogin;
      return obj;
    });
    try {
      notifications.forEach(obj=> obj.save());
      return notifications;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar os dados no db');
    }
  }
}
