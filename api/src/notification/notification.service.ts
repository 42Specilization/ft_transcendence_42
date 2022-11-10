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
  ) { console.log(this.notificationRepository);}

  
  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification | null > {
    const { destination_id, type, send_id} =  createNotificationDto;
    const notification = new Notification();
    if (type !== 'friend' && type !== 'challenge' && type !== 'message') {
      return null;
    }
    notification.destination_id = destination_id;
    notification.type = type;
    notification.send_id = send_id;
    try {
      await this.notificationRepository.save(notification);
      return notification;
    } catch (error) {
      throw new InternalServerErrorException(
        'createUser: Error to create a user!');
    }

  }

  async findNotificationByDestinationId(destination_id: string): Promise<Notification[] | null> {
    return await this.notificationRepository.findBy({ destination_id });
  }
}
