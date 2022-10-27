export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Ball {
  y: number;
  x: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}
export interface Position {
  x: number;
  y: number;
}

export interface Player {
  paddle: Paddle;
  score: number;
  id: string;
}

interface PaddleOrBallSides {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

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
    paddle: {
      x: 10,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      width: 10,
      height: 100,
      color: 'WHITE'
    },
    id: '',
    score: 0
  };

  player2: Player = {
    paddle: {
      x: CANVAS_WIDTH - 20,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      width: 10,
      height: 100,
      color: 'WHITE'
    },
    id: '',
    score: 0
  };



  // watchers: [];
  ball: Ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
  };

  paddleSides(paddle: Paddle): PaddleOrBallSides {
    const paddleSides: PaddleOrBallSides = {
      top: paddle.y,
      bottom: paddle.y + paddle.height,
      left: paddle.x,
      right: paddle.x + paddle.width
    };
    return (paddleSides);
  }

  ballSides(ball: Ball): PaddleOrBallSides {
    const ballSides: PaddleOrBallSides = {
      top: ball.y - ball.radius,
      bottom: ball.y + ball.radius,
      left: ball.x - ball.radius,
      right: ball.x + ball.radius
    };
    return (ballSides);
  }

  isCollision(paddle: Paddle, ball: Ball) {
    const player = this.paddleSides(paddle);
    const ballSides = this.ballSides(ball);

    return (ballSides.right > player.left && ballSides.top < player.bottom &&
      ballSides.left < player.right && ballSides.bottom > player.top);
  }

  resetBall() {
    this.ball.x = CANVAS_WIDTH / 2;
    this.ball.y = CANVAS_HEIGHT / 2;
    this.ball.speed = 5;
    this.ball.velocityX = -this.ball.velocityX;
  }


}