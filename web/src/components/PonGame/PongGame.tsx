/* eslint-disable indent */
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Ball, Canvas, drawCircle, drawFillRect, drawNet, drawText, Rect, TextCanvas } from '../../components/Canvas/Canvas';
import { state } from '../../game/gameState';
import './PongGame.scss';

export function PongGame() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context: CanvasRenderingContext2D | undefined | null;

  const move = (direction: string) => {
    if (!state.game || !currentState.isPlayer) {
      return;
    }

    state.socket?.emit('move', {
      direction: direction, index: state.game?.index
    });
  };

  const drawGame = () => {
    if (!context || !currentState.game) {
      return;
    }
    const player1Rec: Rect = {
      x: currentState.game.player1.paddle.x,
      y: currentState.game.player1.paddle.y,
      w: currentState.game.player1.paddle.w,
      h: currentState.game.player1.paddle.h,
      color: currentState.game.player1.paddle.color
    };
    const player2Rec: Rect = {
      x: currentState.game.player2.paddle.x,
      y: currentState.game.player2.paddle.y,
      w: currentState.game.player2.paddle.w,
      h: currentState.game.player2.paddle.h,
      color: currentState.game.player2.paddle.color
    };
    const ball: Ball = {
      x: currentState.game.ball.x,
      y: currentState.game.ball.y,
      radius: currentState.game.ball.radius,
      color: currentState.game.ball.color
    };
    const scorePlayer1: TextCanvas = {
      x: context.canvas.width / 4,
      y: context.canvas.height / 7,
      color: 'WHITE',
      msg: currentState.game.player1.score,
      fontSize: '50'
    };
    const playerOneName: TextCanvas = {
      x: 80,
      y: 30,
      color: 'WHITE',
      msg: currentState.player1?.name.substring(0, 10),
      fontSize: '25'
    };
    const scorePlayer2: TextCanvas = {
      x: 3 * context.canvas.width / 4,
      y: context.canvas.height / 7,
      color: 'WHITE',
      msg: currentState.game.player2.score,
      fontSize: '50'
    };
    const playerTwoName: TextCanvas = {
      x: context.canvas.width - 100,
      y: 30,
      color: 'WHITE',
      msg: currentState.player2?.name.substring(0, 10),
      fontSize: '25'
    };
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawText(context, scorePlayer1);
    drawText(context, playerOneName);
    drawText(context, scorePlayer2);
    drawText(context, playerTwoName);
    drawNet(context);

    drawCircle(context, ball);
    drawFillRect(context, player1Rec);
    drawFillRect(context, player2Rec);

    if (currentState.game?.hasEnded) {
      if (!context) {
        return;
      }

      const endMessage: TextCanvas = {
        x: 2 * context.canvas.width / 4,
        y: context.canvas.height / 2,
        color: 'WHITE',
        msg: currentState.game.msgEndGame,
        fontSize: '50'
      };
      const quitHelp: TextCanvas = {
        x: 2 * context.canvas.width / 4,
        y: 1.5 * context.canvas.height / 2,
        color: 'white',
        msg: 'Press Q to leave',
        fontSize: '25'
      };
      drawText(context, endMessage);
      drawText(context, quitHelp);
      return;
    }
  };

  useEffect(() => {
    context = canvasRef.current?.getContext('2d');
    drawGame();
  }, [currentState]);




  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
  }, []);

  function handleKeyboard(event: KeyboardEvent) {
    // if (currentState.game?.hasEnded) {
    //   document.removeEventListener('keydown', handleKeyboard);
    //   return;
    // }
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        move('up');
        break;

      case 'ArrowDown':
      case 's':
      case 'S':
        move('down');
        break;

      case 'q':
      case 'Escape':
        window.location.reload();
        break;

      default:
        break;
    }
  }

  return (
    <div className='pongGame'>
      <Canvas
        canvasRef={canvasRef}
      />
    </div>
  );
}