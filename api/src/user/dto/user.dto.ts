import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
}

export class CommunityDto {
  status: string;
  login: string;
  image_url: string;
  ratio: string;
}

export class UserHistoricDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a valid nick!' })
    login: string;
}