export interface Paddle {
  x: number;
  y: number;
  w: number;
  h: number;
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
  name: string;
  quit: boolean;
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
  winner: Player;
  msgEndGame: string;
  paddleIncrement = 5;
  ballSpeed = 5;
  ballVelocityY = 5;
  ballVelocityX = 5;


  player1: Player = {
    paddle: {
      x: 10,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      w: 10,
      h: 100,
      color: '#7C1CED'
    },
    id: '',
    score: 0,
    name: '',
    quit: false
  };

  player2: Player = {
    paddle: {
      x: CANVAS_WIDTH - 20,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      w: 10,
      h: 100,
      color: '#7C1CED'
    },
    id: '',
    score: 0,
    name: '',
    quit: false
  };



  ball: Ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 10,
    speed: 5,
    velocityX: this.ballVelocityX,
    velocityY: this.ballVelocityY,
    color: '#7C1CED'
  };

  paddleSides(paddle: Paddle): PaddleOrBallSides {
    const paddleSides: PaddleOrBallSides = {
      top: paddle.y,
      bottom: paddle.y + paddle.h,
      left: paddle.x,
      right: paddle.x + paddle.w
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

  isPaddleCollision(paddle: Paddle, direction: string): boolean {
    const player = this.paddleSides(paddle);
    if (direction === 'up' && player.top - this.paddleIncrement < 0) {
      return (true);
    } else if (direction === 'down' && player.bottom + this.paddleIncrement > CANVAS_HEIGHT) {
      return (true);
    }
    return (false);
  }

  isBallCollision(paddle: Paddle, ball: Ball) {
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
    if (this.player1.score >= 10 || this.player2.quit) {
      this.hasEnded = true;
      this.winner = this.player1;
      if (this.player2.quit) {
        this.msgEndGame = `${this.player2.name} leave the game`;
      } else {
        this.msgEndGame = `${this.player1.name} is the winner!`;
      }
      return (true);
    } else if (this.player2.score >= 10 || this.player1.quit) {
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
      this.player2.score++;
      this.resetBall();
    } else if (this.ball.x + this.ball.radius > CANVAS_WIDTH) {
      this.player1.score++;
      this.resetBall();
    }
  }


}