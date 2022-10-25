import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Canvas, drawFillRect, Rect } from '../../components/Canvas/Canvas';
import { actions, state } from '../../game/gameState';
import './PongGame.scss';

export function PongGame() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context: CanvasRenderingContext2D | undefined | null;

  const move = (direction: string) => {
    console.log('move to ', direction);
    state.socket?.emit('move', {
      direction: direction, index: state.game?.index
    });
  };

  const drawGame = () => {
    console.log('before draw game', currentState.game);

    if (!context || !currentState.game) {
      return;
    }
    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    // drawCircle(currentState.game?.player1.position.x, currentState.game?.player1.position.y);
    // drawCircle(currentState.game?.player2.position.x, currentState.game?.player2.position.y);
    const player1Rec: Rect = {
      x: currentState.game.player1.position.x,
      y: currentState.game.player1.position.y,
      w: 20, h: 150
    };
    const player2Rec: Rect = {
      x: currentState.game.player2.position.x,
      y: currentState.game.player2.position.y,
      w: 20, h: 150
    };
    console.log('draw game', currentState.game);
    drawFillRect(context, player1Rec);
    drawFillRect(context, player2Rec);
  };

  useEffect(() => {
    context = canvasRef.current?.getContext('2d');
    console.log('current state change');
    drawGame();
  }, [currentState]);




  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard, true);
  }, []);

  function handleKeyboard(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      move('up');
    } else if (event.key == 'ArrowDown') {
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