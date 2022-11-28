import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MsgToClient } from '../chat.class';

export class UserInfoDto {
  name: string;
  image: string;
}

export class GroupDto {
  id: string;
  type: string;
  name?: string;
  image?: string;
  owner?: UserInfoDto;
  admins?: UserInfoDto[];
  members?: UserInfoDto[];
  messages?: MsgToClient[];
  date: Date;
  newMessages: number;
}

export class DirectDto {
  id: string;
  type: string;
  name?: string;
  image?: string;
  messages?: MsgToClient[];
  date: Date;
  newMessages: number;
}

export class GetDirectDto {
  @IsNotEmpty({ message: 'Insert an valid id' })
  id: string;
}
export class GetGroupDto {
  @IsNotEmpty({ message: 'Insert an valid id' })
  id: string;
}


export class DeleteDirectDto {
  @IsNotEmpty({ message: 'Insert an valid id' })
  friend_login: string;
}

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Insert an valid type' })
  type: string;
  @IsNotEmpty({ message: 'Insert an valid name' })
  @MaxLength(15, { message: 'Group Name need have only 15 characters' })
  name: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  confirmPassword?: string;
  @IsOptional()
  image?: string;
  @IsNotEmpty({ message: 'Insert an valid owner' })
  owner: string;
}