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

export function createSocket({ accessToken, socketIOUrl, actions }: CreateSocketOptions): Socket {
  console.log('Creating socket with accessToken: ', accessToken);

  const socket = io(socketIOUrl, {
    auth: {
      token: accessToken
    },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('Connected with socked ID: ', socket.id);
  });

  socket.on('start-game', (game: Game) => {
    actions.updateGame(game);
    console.log('game initialized Game: ', game);
  });

  socket.on('update-game', (game) => {
    console.log('update game ', game);

    actions.updateGame(game);
  });

  return (socket);
}