/* eslint-disable indent */
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Ball, Canvas, drawCircle, drawFillRect, drawNet, drawText, Rect, TextCanvas } from '../../components/Canvas/Canvas';
import { actions, state } from '../../game/gameState';
import './PongGame.scss';

export function PongGame() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context: CanvasRenderingContext2D | undefined | null;

  const move = (direction: string) => {
    if (!state.game) {
      return;
    }
    console.log('move to ', direction);

    state.socket?.emit('move', {
      direction: direction, index: state.game?.index
    });
  };

  const drawGame = () => {
    if (!context || !currentState.game) {
      return;
    }
    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
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
      y: context.canvas.height / 5,
      color: 'WHITE',
      msg: currentState.game.player1.score
    };

    const scorePlayer2: TextCanvas = {
      x: 3 * context.canvas.width / 4,
      y: context.canvas.height / 5,
      color: 'WHITE',
      msg: currentState.game.player2.score
    };
    drawText(context, scorePlayer1);
    drawText(context, scorePlayer2);
    drawFillRect(context, player1Rec);
    drawFillRect(context, player2Rec);
    drawNet(context);
    drawCircle(context, ball);
  };

  useEffect(() => {
    context = canvasRef.current?.getContext('2d');
    drawGame();
    if (currentState.game?.hasEnded) {
      if (!context) {
        return ;
      }
      
      let winner: string;
      if (currentState.game.player1.name === currentState.me?.name) {
        winner = 'You Win!'
      } else if (currentState.game.player2.name === currentState.me?.name) {
        winner = 'You Lose!';
      } else {
        winner = `${currentState.me?.name} is the Winner`;
      }

      const endMessage: TextCanvas = {
        x: 1.4 * context.canvas.width / 4,
        y: context.canvas.height / 2,
        color: 'WHITE',
        msg: winner
      };
      drawText(context, endMessage);
      return ;
    }
  }, [currentState]);




  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard, true);
  }, []);

  function handleKeyboard(event: KeyboardEvent) {
    if (currentState.game?.hasEnded) {
      document.removeEventListener('keydown', handleKeyboard);
      return ;
    }
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

      default:
        break;
    }
    if (event.key === 'ArrowUp' || event.key === 'w') {
      move('up');
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      move('down');
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