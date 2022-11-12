import { IPlayer } from '../game.class';

export class GameDto {
  room: number;
  waiting: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  winner: IPlayer;
  msgEndGame: string;
  player1Name: string;
  player2Name: string;
}