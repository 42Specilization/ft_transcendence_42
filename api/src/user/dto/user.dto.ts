import { DirectDto } from 'src/chat/dto/chat.dto';
import { NotifyDto } from 'src/notification/dto/notify-dto';
import { BlockedDto, FriendsDto } from 'src/relations/dto/relations-dto';

export class UserDto {
  email: string;
  first_name: string;
  image_url: string;
  login: string;
  usual_full_name: string;
  matches: string;
  wins: string;
  lose: string;
  isTFAEnable: boolean;
  tfaValidated: boolean;
  notify: NotifyDto[];
  friends: FriendsDto[];
  blockeds: BlockedDto[];
  directs: DirectDto[];
}
