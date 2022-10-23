import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context: CanvasRenderingContext2D | null;

  const move = (direction: string) => {
    console.log('move is ', direction);
    currentState.socket?.emit('move', direction);
  };

  function drawCircle(x = 10, y = 10) {
    if (!context) {
      return;
    }
    context.beginPath();
    console.log(x, y);
    context.arc(x, y, 10, 0, 360);
    context.fillStyle = 'blue';
    context.fill();
  }


  useEffect(() => {
    actions.initializeSocket();

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawCircle(currentState.game?.player1.position.x, currentState.game?.player1.position.y);
    drawCircle(currentState.game?.player2.position.x, currentState.game?.player2.position.y);
  }, [currentState]);

  return (
    <div className='game'>
      <h1>Play Game</h1>
      <canvas
        ref={canvasRef}
        className='canvas'
        width='640'
        height='480'
      ></canvas>
      <p>
        <button onClick={() => move('right')}>Right</button>
        <button onClick={() => move('left')}>Left</button>
        <button onClick={() => move('up')}>Up</button>
        <button onClick={() => move('down')}>Down</button>
      </p>
    </div>
  );
}