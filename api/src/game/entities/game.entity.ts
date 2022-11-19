/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'integer' })
  winnerScore: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'integer' })
  loserScore: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  reasonEndGame: string;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn()
  winner: User;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn()
  loser: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}