/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { AccessTokenResponse } from 'src/auth/dto/AccessTokenResponse.dto';
import { IntraData } from 'src/auth/dto/IntraData.dto';

export class CreateUserDto {
  @ApiProperty()
  user: IntraData;

  @ApiProperty()
  token: AccessTokenResponse;
}