import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDirectDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform an valid type!' })
  type: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Inform an login!' })
  friend_login: string;


}