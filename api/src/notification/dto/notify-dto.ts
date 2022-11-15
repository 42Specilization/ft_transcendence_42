import { IsNotEmpty } from 'class-validator';

export class NotifyDto {
  id: string;
  type: string;
  user_source: string;
  additional_info: string;
  date: Date;
}

export class NotifyHandlerDto {
  @IsNotEmpty({message: 'Inform a valid id'})
    id: string;
}