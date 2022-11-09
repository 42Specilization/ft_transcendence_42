/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

export interface FriendData {
  online: boolean;
  login: string;
  email: string;
  image_url: string;
}

export class IntraData {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  usual_full_name: string;
  @ApiProperty()
  image_url: string;
  @ApiProperty()
  matches: string;
  @ApiProperty()
  wins: string;
  @ApiProperty()
  lose: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  isTFAEnable: boolean;
  @ApiProperty()
  tfaValidated: boolean | undefined;
  @ApiProperty()
  friends: FriendData[];
}
