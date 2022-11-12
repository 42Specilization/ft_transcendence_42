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
    console.log('user connected', stateStatus.me?.login);

  });

  socket.on('loggedUsers', async (friends: UserData[]) => {
    actionsStatus.updateFriends(friends);
    console.log('logged users:', friends);
  });

  socket.on('updateUser', async (user: UserData) => {
    actionsStatus.updateUser(user);
    console.log('user update:', user);
  });

  socket.on('updateYourself', async (user: UserData) => {
    actionsStatus.updateYourSelf(user);
    console.log('update yourself:', user);
  });

  socket.on('updateUserLogin', async (oldUser: UserData, newUser: UserData) => {
    actionsStatus.updateUserLogin(oldUser, newUser);
    console.log('update user login:', newUser);
  });

  return socket;

}
