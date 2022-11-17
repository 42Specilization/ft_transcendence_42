import { UserDto } from 'src/user/dto/user.dto';

export interface UserMsg {
  login: string;
  image: string;
}

export interface MsgToServer {
  chat: string;
  user: string;
  msg: string;
}

export interface MsgToClient {
  id: string;
  chat: string;
  user: UserMsg;
  date: Date;
}

export interface ChatMsg {
  id: number;
  user: UserDto;
  msg: string;
  date: Date;
}
