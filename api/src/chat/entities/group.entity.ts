/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Message } from './message.entity';
import { GroupController } from './groupController.entity';

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
  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  password: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.directs)
  users: User[];

  @ApiProperty()
  @ManyToMany(() => User)
  admins: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message: Message) => message.direct, { cascade: ['insert', 'update'] })
  messages: Message[];

  @ApiProperty()
  @OneToMany(() => GroupController, (groupController: GroupController) => groupController.group, { cascade: ['insert', 'update'] })
  groupController: GroupController[];

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;


}