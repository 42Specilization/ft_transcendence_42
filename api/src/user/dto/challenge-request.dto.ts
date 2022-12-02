/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import { IsNotEmpty } from 'class-validator';

export class ChallengeRequestDto {

  @IsNotEmpty({ message: 'Inform a user Target!' })
  userTarget: string;

  @IsNotEmpty({ message: 'Inform a user Source!' })
  userSource: string;

  @IsNotEmpty({ message: 'Inform a valid room!' })
  room: number;
}
