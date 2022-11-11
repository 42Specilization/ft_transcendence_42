import { IntraData } from 'src/auth/dto/IntraData.dto';

export interface ChatMsg {
  id: number;
  user: IntraData;
  msg: string;
  date: Date;
}
