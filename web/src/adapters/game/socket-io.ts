import { io, Socket } from 'socket.io-client';
import { Ball } from '../../components/Game/Canvas/Canvas';
import { actionsStatus } from '../status/statusState';
import { AppActions, AppState, Game, IPowerUp, Player, Score } from './gameState';

export const socketIOUrl =
  `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_GAME_NAMESPACE}`;

export interface CreateSocketOptions {
  accessToken?: string | undefined | null;
  socketIOUrl: string;
  state: AppState;
  actions: AppActions;
}

const FPS = 40;

export function createSocket({ accessToken, socketIOUrl, actions, state }: CreateSocketOptions): Socket {

  let syncBall: NodeJS.Timer;

  const socket = io(socketIOUrl, {
    auth: {
      token: accessToken
    },
    transports: ['websocket', 'polling']
  });

  socket.on('start-game', (game: Game) => {
    actionsStatus.iAmInGame();
    actions.updateGame(game);
    actions.setIsPlayer();
    updateBallEmit();
    setTimeout(() => { syncBall = setInterval(updateBallEmit, 1000 / FPS); }, 1000);
  });


  socket.on('update-game', (game: Game) => {
    actions.updateGame(game);
    actions.setIsPlayer();
  });

  socket.on('update-player', (player1: Player, player2: Player) => {
    actions.updatePlayer(player1, player2);
  });

  socket.on('update-ball', (ball: Ball, updateResult: boolean) => {
    if (updateResult) {
      clearInterval(syncBall);
      setTimeout(() => { syncBall = setInterval(updateBallEmit, 1000 / FPS); }, 1000);
    }
    actions.updateBall(ball);
  });

  socket.on('update-score', (score: Score) => {
    actions.updateScore(score);
  });

  socket.on('update-powerUp', (powerUp: IPowerUp) => {
    actions.updatePowerUp(powerUp);
  });

  socket.on('end-game', (game: Game) => {
    clearInterval(syncBall);
    actionsStatus.iAmOnline();
    actions.updateGame(game);
    actions.disconnectSocket();
  });

  socket.on('specs', (game: Game) => {
    if (!state.isPlayer) {
      actions.updateGame(game);
    }
  });

  socket.on('connect_error', () => {
    actions.updateServerError(true);
    setTimeout(() => window.location.reload(), 10000);
  });

  socket.on('user-already-on-connected', () => {
    actions.updateServerError(true);
    setTimeout(() => window.location.reload(), 10000);
  });

  function updateBallEmit() {
    if (state.game?.hasStarted && !state.game.hasEnded && state.isPlayer && state.player1?.socketId === state.socket?.id) {
      state.socket?.emit('update-ball', state.game?.room);
    }
  }




  return (socket);

}