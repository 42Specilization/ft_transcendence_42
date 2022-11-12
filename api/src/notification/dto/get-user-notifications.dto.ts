import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserNotificationsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a valid login' })
    user_login: string;
}