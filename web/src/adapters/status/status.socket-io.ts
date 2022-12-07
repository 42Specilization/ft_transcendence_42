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
  });

  socket.on('updateUserStatus', (login: string, status: string) => {
    actionsStatus.updateUserStatus(login, status);
  });

  socket.on('updateYourselfLogin', (image: string) => {
    actionsStatus.updateYourSelfLogin(image);
  });

  socket.on('updateUserLogin', (oldLogin: string, newLogin: string) => {
    console.log('update user login', oldLogin, newLogin);
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

  socket.on('updateGroupName', (id: string, name: string) => {
    actionsStatus.updateGroupName(id, name);
  });

  socket.on('updateGroupImage', (id: string, image: string) => {
    actionsStatus.updateGroupImage(id, image);
  });

  socket.on('updateGroupPrivacy', () => {
    actionsStatus.updateGroupCommunity();
  });

  socket.on('updateGroupProfile', (id: string) => {
    actionsStatus.updateGroupProfile(id);
  });

  socket.on('updateUserProfileLogin', (oldLogin: string, newLogin: string) => {
    actionsStatus.updateUserProfileLogin(oldLogin, newLogin);
  });

  socket.on('updateUserProfile', (login: string) => {
    actionsStatus.updateUserProfile(login);
  });

  socket.on('closeGroupProfile', (id: string) => {
    actionsStatus.closeGroupProfile(id);
  });

  return socket;
}
