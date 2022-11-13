/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  winner: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  player1Name: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  player2Name: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'integer' })
  player1Score: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'integer' })
  player2Score: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  reasonEndGame: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}