import { io, Socket } from 'socket.io-client';
import { stateGame } from '../game/gameState';
import { AppActionsStatus, AppStateStatus } from './statusState';

export const socketStatusIOUrl =
  `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT
  }/${import.meta.env.VITE_STATUS_NAMESPACE}`;

export interface CreateSocketStatusOptions {
  accessToken?: string | undefined | null;
  socketStatusIOUrl: string;
  stateStatus: AppStateStatus;
  actionsStatus: AppActionsStatus;
}

export function createSocketStatus({
  accessToken,
  socketStatusIOUrl,
  actionsStatus,
}: CreateSocketStatusOptions): Socket {
  const socket = io(socketStatusIOUrl, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', async () => {
    actionsStatus.iAmOnline();
    console.log('ou estou online');
  });

  socket.on('updateUserStatus', (login: string, status: string) => {
    actionsStatus.updateUserStatus(login, status);
    console.log('mudou o status', login, status);
  });

  socket.on('updateYourselfLogin', (image: string) => {
    actionsStatus.updateYourSelfLogin(image);
  });

  socket.on('updateUserLogin', (oldLogin: string, newLogin: string) => {
    actionsStatus.updateUserLogin(oldLogin, newLogin);
  });

  socket.on('updateYourselfImage', (image_url: string) => {
    actionsStatus.updateYourSelfImage(image_url);
  });

  socket.on('updateUserImage', (login: string, image: string) => {
    actionsStatus.updateUserImage(login, image);
  });

  socket.on('updateNotify', async () => {
    actionsStatus.updateNotify();
  });

  socket.on('updateFriend', async () => {
    actionsStatus.updateFriend();
  });

  socket.on('updateBlocked', async (loginSource) => {
    actionsStatus.updateBlocked();
    if (stateGame.game && loginSource === stateGame.game.player2Name) {
      stateGame.socket?.emit('game-not-found', `${loginSource} blocked you!`);
    }
  });

  socket.on('updateDirects', async (chat: string) => {
    actionsStatus.updateDirects(chat);
  });

  return socket;
}
