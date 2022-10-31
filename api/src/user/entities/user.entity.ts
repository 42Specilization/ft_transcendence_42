/* eslint-disable indent */
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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
  @Column({ nullable: true })
  tfaSecret?: string;

  async checkToken(token: string): Promise<boolean> {
    try {
      return (await bcrypt.compare(token, this.token));
    } catch {
      throw new InternalServerErrorException('CheckToken: Error to check the token!');
    }
  }
}
