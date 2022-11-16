/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
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

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.chats)
  users: User[];


}