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

  socket.on('updateStatus', (users: UserData) => {
    actionsStatus.updateStatus(users);
    // console.log('online users:', users);
  });

  socket.on('onlineUsers', (users: UserData[]) => {
    actionsStatus.onlineUsers(users);
    // console.log('online users:', users);
  });

  socket.on('updateYourself', (user: UserData) => {
    actionsStatus.updateYourSelf(user);
    // console.log('update yourself:', user);
  });

  socket.on('updateUserStatus', (user: UserData) => {
    actionsStatus.updateUserStatus(user);
    // console.log('update user status:', user);
  });

  socket.on('updateUserLogin', (oldUser: UserData, newUser: UserData) => {
    actionsStatus.updateUserLogin(oldUser, newUser);
    // console.log('update user login:', oldUser.login, '-> ', newUser.login);
  });

  socket.on('updateUserImage', (user: UserData) => {
    actionsStatus.updateUserImage(user);
    // console.log('update user status:', user);
  });

  socket.on('updateNotify', async (type: string) => {
    actionsStatus.updateNotify(type);
    // console.log('update notify:');
  });

  socket.on('updateFriend', async () => {
    actionsStatus.updateFriend();
    // console.log('update friend:');
  });

  socket.on('updateBlocked', async () => {
    actionsStatus.updateBlocked();
    // console.log('update blocked:');
  });

  socket.on('updateFriendBlocked', async () => {
    actionsStatus.updateFriendBlocked();
    // console.log('remove friend, add blocked:');
  });

  socket.on('updateDirect', async (chat: string) => {
    actionsStatus.updateDirects(chat);
    // console.log('update direct:');
  });

  return socket;

}
