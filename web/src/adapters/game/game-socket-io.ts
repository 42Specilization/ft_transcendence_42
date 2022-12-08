import { io, Socket } from 'socket.io-client';
import { Ball } from '../../components/Game/Canvas/Canvas';
import { actionsStatus } from '../status/statusState';
import { AppActions, AppState, Game, IPowerUp, Player, Score } from './gameState';

export const socketIOUrl =
  `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_GAME_NAMESPACE}`;

export interface CreateSocketOptions {
  accessToken?: string | undefined | null;
  socketIOUrl: string;
  stateGame: AppState;
  actionsGame: AppActions;
}

const FPS = 40;

export function createSocket({ accessToken, socketIOUrl, actionsGame, stateGame }: CreateSocketOptions): Socket {
  let updateBallOrNot: boolean;
  let syncBall: NodeJS.Timer;

  const socket = io(socketIOUrl, {
    auth: {
      token: accessToken
    },
    transports: ['websocket', 'polling']
  });

  socket.on('start-game', (game: Game) => {
    actionsStatus.iAmInGame();
    actionsGame.updateGame(game);
    actionsGame.setIsPlayer();
    updateBallOrNot = true;
    updateBallEmit();
    setTimeout(() => { updateBallOrNot = true; syncBall = setInterval(updateBallEmit, 1000 / FPS); }, 1000);
  });

  socket.on('update-game', (game: Game) => {
    actionsGame.updateGame(game);
    actionsGame.setIsPlayer();
  });

  socket.on('update-player', (player1: Player, player2: Player) => {
    actionsGame.updatePlayer(player1, player2);
  });

  socket.on('update-ball', (ball: Ball, updateResult: boolean) => {
    if (updateResult) {
      actionsGame.updateBall(ball);
      updateBallOrNot = false; 
      clearInterval(syncBall);
      setTimeout(() => { updateBallOrNot = true;  syncBall = setInterval(updateBallEmit, 1000 / FPS); }, 1000);
    } 
    if (updateBallOrNot) {
      actionsGame.updateBall(ball);
    }
  });

  socket.on('update-score', (score: Score) => {
    actionsGame.updateScore(score);
  });

  socket.on('update-powerUp', (powerUp: IPowerUp) => {
    actionsGame.updatePowerUp(powerUp);
  });

  socket.on('end-game', (game: Game) => {
    clearInterval(syncBall);
    actionsStatus.iAmLeaveGame();
    actionsGame.updateGame(game);
    actionsGame.disconnectSocket();
  });

  socket.on('specs', (game: Game) => {
    if (!stateGame.isPlayer) {
      actionsGame.updateGame(game);
    }
  });

  socket.on('connect_error', async () => {
    if (stateGame.challengeNotify)
      await actionsGame.cancelChallengeNotify();
    actionsGame.updateServerError(true);
    setTimeout(() => window.location.reload(), 10000);
  });

  socket.on('user-already-on-connected', () => {
    actionsGame.updateServerError(true);
    setTimeout(() => window.location.reload(), 10000);
  });

  function updateBallEmit() {
    if (updateBallOrNot && stateGame.game?.hasStarted && !stateGame.game.hasEnded && stateGame.isPlayer && stateGame.player1?.socketId === stateGame.socket?.id) {
      stateGame.socket?.emit('update-ball', stateGame.game?.room);
    }
  }

  return (socket);
}