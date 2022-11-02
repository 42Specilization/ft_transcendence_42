import { io, Socket } from 'socket.io-client';
import { AppActions, AppState, Game } from './gameState';

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
  });

  socket.on('update-game', (game: Game) => {
    actions.updateGame(game);
  });

  socket.on('end-game', (game: Game) => {
    actions.updateGame(game);
    actions.endGame();
  });

  socket.on('connect_error', () => {
    console.log('some error ocurred!');
    //handle socket errors
  });

  setInterval(() => {
    if (state.game?.hasStarted && !state.game.hasEnded) {
      socket.emit('update-ball', state.game?.index);
      socket.on('update-ball', (game: Game) => {
        actions.updateGame(game);
      });
    }
  }, 1000 / 10);

  return (socket);
}