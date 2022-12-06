/* eslint-disable indent */
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Canvas, drawCircle, drawFillRect, drawNet, drawPowerUpBox, drawText, } from '../Canvas/Canvas';
import { actionsGame, stateGame } from '../../../adapters/game/gameState';
import { getEndGameData, getGameData } from './data';
import './PongGame.scss';
import { actionsStatus } from '../../../adapters/status/statusState';

export function PongGame() {

  const currentState = useSnapshot(stateGame);
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

    if (currentState.game?.hasEnded && !currentState.serverError) {
      if (!context) {
        return;
      }
      const { endMessage, quitHelp } = getEndGameData(context, currentState.game.msgEndGame);
      drawText(context, endMessage);
      drawText(context, quitHelp);
      return;
    }
  };

  useEffect(() => {
    drawGame();
  }, [currentState.game, currentState.ball, currentState.player1, currentState.player2, currentState.score]);

  //Check with the team if is better the modal ou draw on canvas to show error on socket.
  useEffect(() => {
    if (!context) {
      return;
    }
    const { endMessage, quitHelp } = getEndGameData(context, 'Server Error!');
    drawText(context, endMessage);
    drawText(context, quitHelp);
  }, [currentState.serverError]);

  useEffect(() => {
    window.onkeydown = function handleKeyboard(event: KeyboardEvent) {
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
          actionsStatus.iAmLeaveGame();
          window.location.reload();
          break;

        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        actionsGame.leaveGame();
      }
    });
  }, []);

  return (
    <div className='pongGame'>
      <Canvas
        canvasRef={canvasRef}
      />
    </div>
  );
}