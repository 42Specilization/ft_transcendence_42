import { io, Socket } from 'socket.io-client';
import { AppActionsStatus, AppStateStatus, UserData } from './statusState';

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
    stateStatus.socket?.emit('iAmOnline', {
      login: stateStatus.me?.login,
      image_url: stateStatus.me?.image_url
    });
  });

  socket.on('onlineUsers', (users: UserData[]) => {
    actionsStatus.onlineUsers(users);
    console.log('online users:', users);
  });

  socket.on('updateUser', (user: UserData) => {
    actionsStatus.updateUser(user);
    console.log('user update:', user);
  });

  socket.on('updateYourself', (user: UserData) => {
    actionsStatus.updateYourSelf(user);
    console.log('update yourself:', user);
  });

  socket.on('updateUserLogin', (oldUser: UserData, newUser: UserData) => {
    actionsStatus.updateUserLogin(oldUser, newUser);
    console.log('update user login:', newUser);
  });

  socket.on('updateNotify', async () => {
    actionsStatus.updateNotify();
    console.log('update notify:');
  });

  socket.on('updateFriend', async () => {
    actionsStatus.updateFriend();
    console.log('update friend:');
  });

  socket.on('updateBlocked', async () => {
    actionsStatus.updateBlocked();
    console.log('update Blocked:');
  });

  socket.on('updateRemove', async () => {
    actionsStatus.updateRemove();
    console.log('update Remove:');
  });

  socket.on('updateDirect', async (chat: string) => {
    actionsStatus.updateDirect(chat);
    console.log('update Direct:');
  });

  return socket;

}
