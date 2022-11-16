import { UserDto } from 'src/user/dto/user.dto';

export interface ChatMsg {
  id: number;
  user: UserDto;
  msg: string;
  date: Date;
}
