/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Message } from './message.entity';

import {
  BaseEntity,
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Group extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.directs)
  users: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message: Message) => message.direct, { cascade: ['insert', 'update'] })
  messages: Message[];

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;

}