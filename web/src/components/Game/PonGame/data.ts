import { state } from '../../../adapters/game/gameState';
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
  if (!state.player1 || !state.player2 || !state.ball || !state.score) {
    return (undefined);
  }
  const player1Rect: Rect = {
    x: state.player1.paddle.x,
    y: state.player1.paddle.y,
    w: state.player1.paddle.w,
    h: state.player1.paddle.h,
    color: state.player1.paddle.color
  };
  const player2Rect: Rect = {
    x: state.player2.paddle.x,
    y: state.player2.paddle.y,
    w: state.player2.paddle.w,
    h: state.player2.paddle.h,
    color: state.player2.paddle.color
  };
  const ball: Ball = {
    x: state.ball.x,
    y: state.ball.y,
    radius: state.ball.radius,
    color: state.ball.color
  };
  const scorePlayer1: TextCanvas = {
    x: context.canvas.width / 4,
    y: context.canvas.height / 7,
    color: 'WHITE',
    msg: state.score.player1.toString(),
    fontSize: '50'
  };
  const player1Name: TextCanvas = {
    x: 80,
    y: 30,
    color: 'WHITE',
    msg: state.player1.name.substring(0, 10),
    fontSize: '25'
  };
  const scorePlayer2: TextCanvas = {
    x: 3 * context.canvas.width / 4,
    y: context.canvas.height / 7,
    color: 'WHITE',
    msg: state.score.player2.toString(),
    fontSize: '50'
  };
  const player2Name: TextCanvas = {
    x: context.canvas.width - 100,
    y: 30,
    color: 'WHITE',
    msg: state.player2.name.substring(0, 10),
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

export function getEndGameData(context: CanvasRenderingContext2D): IEndGameData | undefined {
  if (!state.game) {
    return;
  }
  const endMessage: TextCanvas = {
    x: 2 * context.canvas.width / 4,
    y: context.canvas.height / 2,
    color: 'WHITE',
    msg: state.game.msgEndGame,
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