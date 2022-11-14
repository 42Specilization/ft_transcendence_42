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
export class Relations extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  type: string;

  @ApiProperty()
  @ManyToOne(() => User, (user: User) => user.relations, { orphanedRowAction: 'delete' })
  active_user: User;
  
  @ApiProperty()
  @ManyToOne(() => User, { cascade: true })
  passive_user: User;

}
