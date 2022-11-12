import { io, Socket } from 'socket.io-client';
import { AppActionsStatus, AppStateStatus, UserOnline } from './statusState';

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

  socket.on('loggedUsers', async (friends: UserOnline[]) => {
    actionsStatus.updateFriends(friends);
    console.log('friends online:', friends);
  });

  socket.on('updateUser', async (user: UserOnline) => {
    actionsStatus.updateUserStatus(user);
    console.log('new friend online:', user);
  });

  socket.on('updateYourself', async (user: UserOnline) => {
    actionsStatus.updateYourSelf(user);
    console.log('update yourself:', user);
  });

  socket.on('updateUserLogin', async (oldUser: UserOnline, newUser: UserOnline) => {
    actionsStatus.updateUser(oldUser, newUser);
    console.log('update user:', newUser);
  });

  return socket;

}