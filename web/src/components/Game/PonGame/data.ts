import { stateGame } from '../../../adapters/game/gameState';
import { Rect, Ball, TextCanvas } from '../Canvas/Canvas';

export interface IGameData {
  ball: Ball;
  player1Rect: Rect;
  player2Rect: Rect;
  player1Name: TextCanvas;
  player2Name: TextCanvas;
  scorePlayer1: TextCanvas;
  scorePlayer2: TextCanvas;
}

export function getGameData(context: CanvasRenderingContext2D): IGameData | undefined {
  if (!stateGame.player1 || !stateGame.player2 || !stateGame.ball || !stateGame.score) {
    return (undefined);
  }
  const player1Rect: Rect = {
    x: stateGame.player1.paddle.x,
    y: stateGame.player1.paddle.y,
    w: stateGame.player1.paddle.w,
    h: stateGame.player1.paddle.h,
    color: stateGame.player1.paddle.color
  };
  const player2Rect: Rect = {
    x: stateGame.player2.paddle.x,
    y: stateGame.player2.paddle.y,
    w: stateGame.player2.paddle.w,
    h: stateGame.player2.paddle.h,
    color: stateGame.player2.paddle.color
  };
  const ball: Ball = {
    x: stateGame.ball.x,
    y: stateGame.ball.y,
    radius: stateGame.ball.radius,
    color: stateGame.ball.color
  };
  const scorePlayer1: TextCanvas = {
    x: context.canvas.width / 4,
    y: context.canvas.height / 7,
    color: 'WHITE',
    msg: stateGame.score.player1.toString(),
    fontSize: '50'
  };
  const player1Name: TextCanvas = {
    x: 80,
    y: 30,
    color: 'WHITE',
    msg: stateGame.player1.name.substring(0, 10),
    fontSize: '25'
  };
  const scorePlayer2: TextCanvas = {
    x: 3 * context.canvas.width / 4,
    y: context.canvas.height / 7,
    color: 'WHITE',
    msg: stateGame.score.player2.toString(),
    fontSize: '50'
  };
  const player2Name: TextCanvas = {
    x: context.canvas.width - 100,
    y: 30,
    color: 'WHITE',
    msg: stateGame.player2.name.substring(0, 10),
    fontSize: '25'
  };

  return ({
    ball,
    player1Rect,
    player2Rect,
    player1Name,
    player2Name,
    scorePlayer1,
    scorePlayer2
  });
}

interface IEndGameData {
  endMessage: TextCanvas;
  quitHelp: TextCanvas;
}

export function getEndGameData(context: CanvasRenderingContext2D, msgEndGame: string): IEndGameData {
  const endMessage: TextCanvas = {
    x: 2 * context.canvas.width / 4,
    y: context.canvas.height / 2,
    color: 'WHITE',
    msg: msgEndGame,
    fontSize: '50'
  };
  const quitHelp: TextCanvas = {
    x: 2 * context.canvas.width / 4,
    y: 1.5 * context.canvas.height / 2,
    color: 'white',
    msg: 'Press Q to leave',
    fontSize: '25'
  };
  return ({
    endMessage,
    quitHelp
  });
}