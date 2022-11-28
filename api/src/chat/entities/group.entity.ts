/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GroupController } from './groupController.entity';
// import { MessageGroup } from './messageGroup.entity';

import {
  BaseEntity,
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Group extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  image: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  password: string | null;

  @ApiProperty()
  @ManyToOne(() => User)
  owner: User;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @ApiProperty()
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message: Message) => message.group, { cascade: ['insert', 'update'] })
  messages: Message[];

  @ApiProperty()
  @OneToMany(() => GroupController, (groupController: GroupController) => groupController.group, { cascade: ['insert', 'update'] })
  groupController: GroupController[];

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;


}