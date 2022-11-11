import { io, Socket } from 'socket.io-client';
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
  stateStatus,
}: CreateSocketStatusOptions): Socket {
  const socket = io(socketStatusIOUrl, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('user connected', stateStatus.me?.name);

  });

  socket.on('newUserOnline', async (email: string) => {
    actionsStatus.updateFriendStatus(email, true);
    console.log('new friend online:', email);
  });

  socket.on('newUserOffline', async (email: string) => {
    actionsStatus.updateFriendStatus(email, false);
    console.log('new friend offline:', email);
  });

  socket.on('friendsOnline', async (emails: string[]) => {
    actionsStatus.updateUsersOnline(emails);
    console.log('friends online:', emails);
  });

  return socket;

}