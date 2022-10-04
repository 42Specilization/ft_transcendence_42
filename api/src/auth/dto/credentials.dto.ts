/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;
}