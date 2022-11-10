import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['id'])
export class Notification extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar'})
    destination_id: string;
    
    
  @ApiProperty()
  @Column({ nullable: false, type: 'varchar'})
    type: string;
  
  @ApiProperty()
  @Column({ nullable: false, type: 'varchar'})
    send_id: string;
}
