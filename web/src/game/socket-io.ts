import { io, Socket } from 'socket.io-client';
import { Ball } from '../components/Canvas/Canvas';
import { AppActions, AppState, Game, Player, Score } from './gameState';

export const socketIOUrl =
  `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_GAME_NAMESPACE}`;

export interface CreateSocketOptions {
  accessToken?: string | undefined | null;
  socketIOUrl: string;
  state: AppState;
  actions: AppActions;
}

export function createSocket({ accessToken, socketIOUrl, actions, state }: CreateSocketOptions): Socket {

  const socket = io(socketIOUrl, {
    auth: {
      token: accessToken
    },
    transports: ['websocket', 'polling']
  });

  // socket.on('connect', () => {
  // });

  socket.on('start-game', (game: Game) => {
    actions.updateGame(game);
    actions.setIsPlayer();
    window.requestAnimationFrame(updateBallEmit);
  });


  socket.on('update-game', (game: Game) => {
    actions.updateGame(game);

  });

  socket.on('update-player', (player1: Player, player2: Player) => {
    actions.updatePlayer(player1, player2);
  });

  socket.on('update-ball', (ball: Ball) => {
    actions.updateBall(ball);
  });

  socket.on('update-score', (score: Score) => {
    actions.updateScore(score);
  });

  socket.on('end-game', (game: Game) => {
    actions.updateGame(game);
    actions.disconnectSocket();
  });

  socket.on('specs', (game: Game) => {
    if (!state.isPlayer) {
      actions.updateGame(game);
    }
  });

  socket.on('connect_error', () => {
    console.log('some error ocurred!');
    window.location.reload();
    //handle socket errors
  });

  function updateBallEmit() {
    if (state.game?.hasStarted && !state.game.hasEnded && state.isPlayer && state.player1?.socketId === state.me?.id) {
      state.socket?.emit('update-ball', state.game?.room);
      window.requestAnimationFrame(updateBallEmit);
    }
  }



  return (socket);

}