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
    window.requestAnimationFrame(updateBall);
  });

  socket.on('update-game', (game: Game) => {
    actions.updateGame(game);
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

  // socket.on('exception', (err) => {
  //   console.log('err ', err);
  // });

  socket.on('update-ball', (game: Game) => {
    actions.updateGame(game);
  });

  function updateBall() {
    if (state.game?.hasStarted && !state.game.hasEnded && state.isPlayer && state.game.player1.id === state.me?.id) {
      socket.emit('update-ball', state.game?.index);
      window.requestAnimationFrame(updateBall);
    }
  }
  // setInterval(() => {
  //   if (state.game?.hasStarted && !state.game.hasEnded && state.isPlayer && state.game.player1.id === state.me?.id) {
  //     socket.emit('update-ball', state.game?.index);
  //   }
  // }, 1000 / 50);



  return (socket);
}