/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Message } from './message.entity';

import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Chat extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  type: string;

  // @ApiProperty()
  // // @Column({ nullable: false })
  // admins: string[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.chats)
  users: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message: Message) => message.chat, { cascade: ['insert'] })
  messages: Message[];

}