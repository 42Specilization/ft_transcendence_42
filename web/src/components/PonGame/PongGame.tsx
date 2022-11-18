/* eslint-disable indent */
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Canvas, drawCircle, drawFillRect, drawNet, drawPowerUpBox, drawText, } from '../../components/Canvas/Canvas';
import { state } from '../../game/gameState';
import { getEndGameData, getGameData } from './data';
import './PongGame.scss';

export function PongGame() {

  const currentState = useSnapshot(state);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const context: CanvasRenderingContext2D | undefined | null = canvasRef.current?.getContext('2d');
  const img = document.getElementById('powerUp-box');

  const move = (direction: string) => {
    if (!currentState.game || !currentState.isPlayer) {
      return;
    }
    currentState.socket?.emit('move', {
      direction: direction, room: currentState.game?.room
    });
  };

  const drawGame = () => {
    if (!context || !currentState) {
      return;
    }
    const gameData = getGameData(context);
    if (!gameData) {
      return;
    }
    const { ball, player1Name, player1Rect, player2Name, player2Rect, scorePlayer1, scorePlayer2 } = gameData;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawText(context, scorePlayer1);
    drawText(context, player1Name);
    drawText(context, scorePlayer2);
    drawText(context, player2Name);
    drawNet(context);

    drawCircle(context, ball);
    drawFillRect(context, player1Rect);
    drawFillRect(context, player2Rect);

    if (currentState.powerUp && currentState.powerUp.itsDrawn) {
      if (!img) {
        return;
      }
      drawPowerUpBox(context, currentState.powerUp.position.x, currentState.powerUp.position.y, img);
    }

    if (currentState.game?.hasEnded) {
      if (!context) {
        return;
      }
      const endGameData = getEndGameData(context);
      if (!endGameData) {
        return;
      }
      const { endMessage, quitHelp } = endGameData;
      drawText(context, endMessage);
      drawText(context, quitHelp);
      return;
    }
  };

  useEffect(() => {
    drawGame();
  }, [currentState.game, currentState.ball, currentState.player1, currentState.player2, currentState.score]);


  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
  }, []);

  function handleKeyboard(event: KeyboardEvent) {
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