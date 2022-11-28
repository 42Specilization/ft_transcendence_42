import { IsNotEmpty } from 'class-validator';

export class NotifyDto {
  id: string;
  type: string;
  user_source: string;
  additional_info: string | null;
  date: Date;
}

export class NewNotifyDto {
  @IsNotEmpty({ message: 'Inform a valid id' })
  id: string;
  @IsNotEmpty({ message: 'Inform a valid chat name' })
  target: string;

  @IsNotEmpty({ message: 'Inform a valid add Info' })
  add_info: string;
}

export class NotifyHandlerDto {
  @IsNotEmpty({ message: 'Inform a valid id' })
  id: string;
}