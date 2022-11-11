export interface IPaddle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

interface IBall {
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

export interface IPlayer {
  paddle: IPaddle;
  socketId: string;
  name: string;
  quit: boolean;
}

interface IPaddleOrBallSides {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface IScore {
  player1: number;
  player2: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export class Game {

  constructor(room: number, index: number) {
    this.room = room;
    this.index = index;
    this.waiting = true;
    this.hasEnded = false;
    this.hasStarted = false;
  }

  room: number;
  index: number;
  waiting: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  winner: IPlayer;
  msgEndGame: string;
  paddleIncrement = 5;
  ballSpeed = 5;
  ballVelocityY = 5;
  ballVelocityX = 5;
  score: IScore = {
    player1: 0,
    player2: 0
  };


  player1: IPlayer = {
    paddle: {
      x: 10,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      w: 10,
      h: 100,
      color: '#7C1CED'
    },
    socketId: '',
    name: '',
    quit: false
  };

  player2: IPlayer = {
    paddle: {
      x: CANVAS_WIDTH - 20,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      w: 10,
      h: 100,
      color: '#7C1CED'
    },
    socketId: '',
    name: '',
    quit: false
  };



  ball: IBall = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 10,
    speed: this.ballSpeed,
    velocityX: this.ballVelocityX,
    velocityY: this.ballVelocityY,
    color: '#7C1CED'
  };

  paddleSides(paddle: IPaddle): IPaddleOrBallSides {
    const paddleSides: IPaddleOrBallSides = {
      top: paddle.y,
      bottom: paddle.y + paddle.h,
      left: paddle.x,
      right: paddle.x + paddle.w
    };
    return (paddleSides);
  }

  ballSides(ball: IBall): IPaddleOrBallSides {
    const ballSides: IPaddleOrBallSides = {
      top: ball.y - ball.radius,
      bottom: ball.y + ball.radius,
      left: ball.x - ball.radius,
      right: ball.x + ball.radius
    };
    return (ballSides);
  }

  isPaddleCollision(paddle: IPaddle, direction: string): boolean {
    const player = this.paddleSides(paddle);
    if (direction === 'up' && player.top - this.paddleIncrement < 0) {
      return (true);
    } else if (direction === 'down' && player.bottom + this.paddleIncrement > CANVAS_HEIGHT) {
      return (true);
    }
    return (false);
  }

  isBallCollision(paddle: IPaddle, ball: IBall) {
    const player = this.paddleSides(paddle);
    const ballSides = this.ballSides(ball);

    return (ballSides.right > player.left && ballSides.top < player.bottom &&
      ballSides.left < player.right && ballSides.bottom > player.top);
  }

  resetBall() {
    this.ball.x = CANVAS_WIDTH / 2;
    this.ball.y = CANVAS_HEIGHT / 2;
    this.ball.speed = this.ballSpeed;
    this.ball.velocityX = -this.ball.velocityX;
  }

  checkWinner(): boolean {
    if (this.score.player1 >= 10 || this.player2.quit) {
      this.hasEnded = true;
      this.winner = this.player1;
      if (this.player2.quit) {
        this.msgEndGame = `${this.player2.name} leave the game`;
      } else {
        this.msgEndGame = `${this.player1.name} is the winner!`;
      }
      return (true);
    } else if (this.score.player2 >= 10 || this.player1.quit) {
      this.hasEnded = true;
      this.winner = this.player2;
      if (this.player1.quit) {
        this.msgEndGame = `${this.player1.name} leave the game`;
      } else {
        this.msgEndGame = `${this.player2.name} is the winner!`;
      }
      return (true);
    } else {
      return (false);
    }
  }

  update() {

    // move the ball
    this.ball.x += this.ball.velocityX;
    this.ball.y += this.ball.velocityY;

    // ball collision with the top and bottom of the canvas.
    if (this.ball.y + this.ball.radius > CANVAS_HEIGHT ||
      this.ball.y - this.ball.radius < 0) {
      this.ball.velocityY = -this.ball.velocityY;
    }

    const player = (this.ball.x < CANVAS_WIDTH / 2) ? this.player1 : this.player2;

    if (this.isBallCollision(player.paddle, this.ball)) {
      // where the ball hit the player
      let collidePoint = (this.ball.y - (player.paddle.y + player.paddle.h / 2));
      collidePoint = collidePoint / (player.paddle.h / 2);
      //calculate angle in Radian
      const angleRad = (Math.PI / 4) * collidePoint;

      //X direction of the ball when it's hit
      const direction = (this.ball.x < CANVAS_WIDTH / 2) ? 1 : -1;
      //change vel X and Y
      this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
      this.ball.velocityY = this.ball.speed * Math.sin(angleRad);

      // every time the ball hit a paddle, we increase its speed
      this.ball.speed += 0.5;
    }

    // update the score
    if (this.ball.x - this.ball.radius < 0) {
      this.score.player2++;
      this.resetBall();
      return (true);
    } else if (this.ball.x + this.ball.radius > CANVAS_WIDTH) {
      this.score.player1++;
      this.resetBall();
      return (true);
    }
    return (false);
  }


}