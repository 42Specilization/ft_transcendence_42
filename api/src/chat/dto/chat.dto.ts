import { IsNotEmpty } from 'class-validator';
import { MsgToClient } from '../chat.class';

export class DirectDto {
  id: string;
  type: string;
  name?: string;
  image?: string;
  messages?: MsgToClient[];
  date: Date;
}

export class GetDirectDto {
  @IsNotEmpty({ message: 'Insert an valid id' })
    id: string;
}