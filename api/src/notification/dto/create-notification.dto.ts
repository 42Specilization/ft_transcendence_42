import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column } from 'typeorm';

export class CreateNotificationDto extends BaseEntity {

  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a destination_nick' })
  @Column({ nullable: false, type: 'varchar'})
    destination_nick: string;
  
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a type' })
  @Column({ nullable: false, type: 'varchar'})
    type: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Inform a requester' })
  @Column({ nullable: false, type: 'varchar'})
    sender_nick: string;
}
