import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let context: CanvasRenderingContext2D | null;

  const move = (direction: string) => {
    console.log('move to ', direction);
    state.socket?.emit('move', {
      direction: direction, index: state.game?.index
    });
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

  function drawFillRect(info: any, style: any = {}) {
    const { x, y, w, h } = info;
    const { backgroundColor = 'black' } = style;

    if (!context) {
      return;
    }

    context.beginPath();
    context.fillStyle = backgroundColor;

    context.fillRect(x, y, w, h);
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
    // drawCircle(currentState.game?.player1.position.x, currentState.game?.player1.position.y);
    // drawCircle(currentState.game?.player2.position.x, currentState.game?.player2.position.y);

    const player1Rec = {
      x: currentState.game?.player1.position.x,
      y: currentState.game?.player1.position.y,
      w: 20, h: 150
    };
    const player2Rec = {
      x: currentState.game?.player2.position.x,
      y: currentState.game?.player2.position.y,
      w: 20, h: 150
    };
    console.log(currentState.game);
    drawFillRect(player1Rec);
    drawFillRect(player2Rec);
  }, [currentState]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard, true);
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (!context) {
  //       return;
  //     }

  //     context.canvas.height = window.innerHeight;
  //     context.canvas.width = window.innerWidth;
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);

  //   return () => window.removeEventListener('resize', handleResize);

  // }, []);

  function handleKeyboard(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      move('up');
    } else if (event.key == 'ArrowDown') {
      move('down');
    }
  }

  return (
    <div className='game'>
      <div className='canvas-div'>
        <canvas
          ref={canvasRef}
          className='canvas'
          width={640}
          height={440}
        ></canvas>
      </div>
    </div>
  );
}