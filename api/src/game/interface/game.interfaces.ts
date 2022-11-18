export interface IPaddle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface IBall {
  y: number;
  x: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IPowerUp {
  position: IPosition;
  w: number;
  h: number;
  itsDrawn: boolean;
  updateSend: boolean;
  isActive: boolean;
}

export interface IPlayer {
  paddle: IPaddle;
  socketId: string;
  name: string;
  quit: boolean;
}

export interface IObjectSides {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface IScore {
  player1: number;
  player2: number;
}