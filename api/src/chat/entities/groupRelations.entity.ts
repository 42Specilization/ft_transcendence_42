/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class GroupRelations extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  date: Date;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @ApiProperty()
  @ManyToOne(() => User)
  user_target: User;

  @ApiProperty()
  @ManyToOne(() => Group, (group: Group) => group.relations, { orphanedRowAction: 'delete' })
  group: Group;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  additional_info: string;

}