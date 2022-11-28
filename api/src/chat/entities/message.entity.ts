/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Direct } from './direct.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Message extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => Direct, (direct: Direct) => direct.messages, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  direct?: Direct;

  // @ApiProperty()
  // @ManyToOne(() => Chat, (chat: Chat) => chat.messages, { orphanedRowAction: 'delete' })
  // group?: Chat;

  @ApiProperty()
  @ManyToOne(() => User)
  sender: User;

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;

  @ApiProperty()
  @Column({ nullable: false })
  msg: string;

  @ApiProperty()
  @Column({ default: false })
  breakproint: boolean;

}
