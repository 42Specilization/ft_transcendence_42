/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  looserScore: number;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  reasonEndGame: string;

  @ApiProperty()
  @OneToOne(() => User)
  @JoinColumn()
  winner: User;

  @ApiProperty()
  @OneToOne(() => User)
  @JoinColumn()
  looser: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}