/* eslint-disable indent */
import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotifyDto {
  id: string;
  type: string;
  user_source: string;
  user_target: string | null;
  additional_info: string | null;
  date: Date;
}

export class NotifyHandlerDto {
  @IsNotEmpty({ message: 'Inform a valid id' })
  id: string;

  @IsOptional()
  notify: NotifyDto;
}