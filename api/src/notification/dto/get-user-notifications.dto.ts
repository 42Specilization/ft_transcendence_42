import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserNotificationsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a valid email' })
    user_email: string;
}