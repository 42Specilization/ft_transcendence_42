import { getRandomInt } from 'src/utils/utils';
import { CreateGameDto } from './dto/createGame.dto';
import { GameDto } from './dto/Game.dto';
import { IPlayer, IScore, IBall, IPaddle, IObjectSides, IPowerUp } from './interface/game.interfaces';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const DEFAULT_PADDLE_HEIGHT = 100;
const BIG_PADDLE = 0;
const LITTLE_PADDLE = 1;
const BIG_BALL = 2;

export class Game {

  constructor(room: number, index: number, isWithPowerUps = false, isChallenge = false) {
    this.room = room;
    this.index = index;
    this.waiting = true;
    this.hasEnded = false;
    this.hasStarted = false;
    this.isWithPowerUps = isWithPowerUps;
    this.isChallenge = isChallenge;
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
  score: IScore = {
    player1: 0,
    player2: 0
  };
  ballLastHit: number;
  isWithPowerUps: boolean;
  isChallenge: boolean;

  player1: IPlayer = {
    paddle: {
      x: 10,
      y: (CANVAS_HEIGHT / 2) - (DEFAULT_PADDLE_HEIGHT / 2),
      w: 10,
      h: DEFAULT_PADDLE_HEIGHT,
      color: '#7C1CED'
    },
    socketId: '',
    name: '',
    quit: false
  };

  player2: IPlayer = {
    paddle: {
      x: CANVAS_WIDTH - 20,
      y: (CANVAS_HEIGHT / 2) - (DEFAULT_PADDLE_HEIGHT / 2),
      w: 10,
      h: DEFAULT_PADDLE_HEIGHT,
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
    velocityX: this.getRandomDirection(),
    velocityY: this.getRandomDirection(),
    color: '#7C1CED'
  };

  powerUpBox: IPowerUp = {
    position: {
      x: 300,
      y: 200
    },
    itsDrawn: false,
    updateSend: false,
    w: 64,
    h: 64,
    isActive: false
  };

  paddleSides(paddle: IPaddle): IObjectSides {
    const paddleSides: IObjectSides = {
      top: paddle.y,
      bottom: paddle.y + paddle.h,
      left: paddle.x,
      right: paddle.x + paddle.w
    };
    return (paddleSides);
  }

  boxPowerUpSides(powerUp: IPowerUp): IObjectSides {
    const boxSides: IObjectSides = {
      top: powerUp.position.y,
      bottom: powerUp.position.y + powerUp.h,
      left: powerUp.position.x,
      right: powerUp.position.x + powerUp.w
    };
    return (boxSides);
  }

  ballSides(ball: IBall): IObjectSides {
    const ballSides: IObjectSides = {
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

  isBallCollision(item: IObjectSides, ball: IBall) {
    const ballSides = this.ballSides(ball);

    return (ballSides.right > item.left && ballSides.top < item.bottom &&
      ballSides.left < item.right && ballSides.bottom > item.top);
  }

  resetPowerUp() {
    this.powerUpBox.itsDrawn = false;
    this.powerUpBox.updateSend = false;
    this.powerUpBox.isActive = false;
    this.player1.paddle.h = DEFAULT_PADDLE_HEIGHT;
    this.player2.paddle.h = DEFAULT_PADDLE_HEIGHT;
  }

  getRandomDirection(): number {
    if (getRandomInt(1, 100) % 3) {
      return (-5);
    } else {
      return (5);
    }
  }

  resetBall() {
    this.ball.x = CANVAS_WIDTH / 2;
    this.ball.y = CANVAS_HEIGHT / 2;
    this.ball.radius = 10;
    this.ball.speed = this.ballSpeed;
    this.ball.velocityX = this.getRandomDirection();
    this.ball.velocityY = this.getRandomDirection();
    if (this.isWithPowerUps) {
      this.resetPowerUp();
    }
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

  generateBoxPosition() {
    this.powerUpBox.position.x = getRandomInt(30 + this.powerUpBox.w, 770 - this.powerUpBox.h);
    this.powerUpBox.position.y = getRandomInt(50 + this.powerUpBox.w, 550 - this.powerUpBox.h);
    this.powerUpBox.itsDrawn = true;
    this.powerUpBox.updateSend = true;
  }

  randomPowerUp() {
    let player = this.ballLastHit === 1 ? this.player1 : this.player2;
    const powerUp = getRandomInt(0, 2);

    if (powerUp === BIG_PADDLE) {
      player.paddle.h = 200;
    } else if (powerUp === LITTLE_PADDLE) {
      player = this.ballLastHit === 1 ? this.player2 : this.player1;
      player.paddle.h = 50;
    } else if (powerUp === BIG_BALL) {
      this.ball.radius = 40;
    }
  }

  checkPowerUp() {
    if (!this.powerUpBox.itsDrawn) {
      return;
    }
    if (this.isBallCollision(this.boxPowerUpSides(this.powerUpBox), this.ball)) {
      this.powerUpBox.itsDrawn = false;
      this.powerUpBox.updateSend = true;
      this.powerUpBox.isActive = true;
      this.randomPowerUp();
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

    if (this.isBallCollision(this.paddleSides(player.paddle), this.ball)) {
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
      this.ballLastHit = (this.ball.x < CANVAS_WIDTH / 2) ? 1 : 2;
      if (this.isWithPowerUps && !this.powerUpBox.itsDrawn && !this.powerUpBox.isActive) {
        this.generateBoxPosition();
      }
    }

    if (this.isWithPowerUps) {
      this.checkPowerUp();
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

  getGameDto(): GameDto {
    const gameDto: GameDto = {
      room: this.room,
      waiting: this.waiting,
      hasStarted: this.hasStarted,
      hasEnded: this.hasEnded,
      winner: this.winner,
      msgEndGame: this.msgEndGame,
      player1Name: this.player1.name,
      player2Name: this.player2.name,
    };
    return (gameDto);
  }

  getReasonEndGame(): string {
    if (this.player1.quit) {
      return (`player ${this.player1.name} quit the game!`);
    } else if (this.player2.quit) {
      return (`player ${this.player2.name} quit the game!`);
    } else {
      return ('Enough score points!');
    }
  }

  getCreateGameDto(): CreateGameDto {

    let winner: string;
    let loser: string;
    let loserScore = 0;
    let winnerScore = 0;
    if (this.player1.name === this.winner.name) {
      winner = this.player1.name;
      winnerScore = this.score.player1;
      loser = this.player2.name;
      loserScore = this.score.player2;
    } else {
      winner = this.player2.name;
      winnerScore = this.score.player2;
      loser = this.player1.name;
      loserScore = this.score.player1;
    }

    const createGameDto: CreateGameDto = {
      loser: loser,
      winner: winner,
      reasonEndGame: this.getReasonEndGame(),
      loserScore: loserScore,
      winnerScore: winnerScore
    };

    return (createGameDto);
  }

}
