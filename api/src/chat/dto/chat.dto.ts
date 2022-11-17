import { IsNotEmpty } from 'class-validator';
import { MsgToClient } from '../chat.class';

export class DirectUserDto {
  login: string;
  image_url: string;
}

export class DirectDto {
  id: string;
  type: string;
  name?: string;
  image?: string;
  users: DirectUserDto[];
  messages? : MsgToClient[];
}

export class DirectChat {
  id: string;
  type: string;
  name?: string;
  image?: string;
  messages? : MsgToClient[];
}

export class GetDirectDto {
  @IsNotEmpty({message: 'Insert an valid id'})
    id: string;
}