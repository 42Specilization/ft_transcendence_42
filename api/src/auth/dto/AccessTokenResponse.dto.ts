/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {

  @ApiProperty()
  access_token: string;
  @ApiProperty()
  token_type: string;
  @ApiProperty()
  expires_in: number;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  scope: string;
  @ApiProperty()
  created_at: number;
}