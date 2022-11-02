/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

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
  login: string;
  @ApiProperty()
  isTFAEnable: boolean;
}
