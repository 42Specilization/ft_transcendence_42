/* eslint-disable indent */
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@Entity()
@Unique(['id'])
export class Notify extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @ApiProperty()
  @ManyToOne(() => User, (user: User) => user.notify, { orphanedRowAction: 'delete' })
  user_target: User;

  @ApiProperty()
  @ManyToOne(() => User, { cascade: true })
  user_source: User;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  additional_info: string;
}
