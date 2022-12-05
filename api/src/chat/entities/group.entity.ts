/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GroupRelations } from './groupRelations.entity';

import {
  BaseEntity,
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
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
  @OneToMany(() => Message, (message: Message) => message.group, { cascade: ['insert', 'update'] })
  messages: Message[];

  @ApiProperty()
  @OneToMany(() => GroupRelations, (groupRelations: GroupRelations) => groupRelations.group, {
    cascade: ['insert', 'update']
  })
  relations: GroupRelations[];

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;


}