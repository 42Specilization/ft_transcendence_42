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
      w: 10,
      h: 100,
      color: 'WHITE'
    },
    id: '',
    score: 0
  };

  player2: Player = {
    paddle: {
      x: CANVAS_WIDTH - 20,
      y: (CANVAS_HEIGHT / 2) - (100 / 2),
      w: 10,
      h: 100,
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

    if (this.isCollision(player.paddle, this.ball)) {
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