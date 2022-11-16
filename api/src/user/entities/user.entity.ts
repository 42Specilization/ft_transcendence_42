/* eslint-disable indent */
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Notify } from 'src/notification/entities/notify.entity';
import { Relations } from 'src/relations/entity/relations.entity';

@Entity()
@Unique(['email', 'nick'])
export class User extends BaseEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar', length: 50 })
  first_name: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar', length: 200 })
  usual_full_name: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar', length: 50 })
  nick: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  imgUrl: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  token: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  matches: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  wins: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  lose: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ default: false })
  tfaValidated?: boolean;

  @ApiProperty()
  @IsEmail()
  @Column({ nullable: true })
  tfaEmail?: string;

  @ApiProperty()
  @Column({ nullable: true })
  tfaCode?: string;

  @ApiProperty()
  @Column({ default: false })
  isTFAEnable: boolean;

  @ApiProperty()
  @OneToMany(() => Notify, (notify) => notify.user_target, { cascade: ['insert'] })
  notify: Notify[];
  
  @ApiProperty()
  @OneToMany(() => Relations, (relations) => relations.active_user, { cascade: ['insert', 'update'] })
  relations: Relations[];

  async checkToken(token: string): Promise<boolean> {
    try {
      return (await bcrypt.compare(token, this.token));
    } catch {
      throw new InternalServerErrorException('CheckToken: Error to check the token!');
    }
  }
}
