export interface Position {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  id: string;
}

export class Game {

  constructor(id: number, index: number) {
    this.id = id;
    this.index = index;
    this.waiting = true;
    this.hasEnded = false;
    this.hasStarted = false;
  }

  id: number;
  index: number;
  waiting: boolean;
  hasStarted: boolean;
  hasEnded: boolean;

  player1: Player = {
    position: {
      x: 20,
      y: 200
    },
    id: ''
  };

  player2: Player = {
    position: {
      x: 600,
      y: 200
    },
    id: ''
  };

  // watchers: [];
  ball: Position = {
    x: 300,
    y: 200
  };


}