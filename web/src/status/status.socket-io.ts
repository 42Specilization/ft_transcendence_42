import { io, Socket } from 'socket.io-client';
import { IntraData } from '../Interfaces/interfaces';
import { getInfos } from '../pages/OAuth/OAuth';
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
  // actionsStatus,
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
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);

    data.friends = data.friends.map(obj => {
      if (obj.email === email)
        obj.online = true;
      return obj;

    });
    window.localStorage.setItem('userData', JSON.stringify(data));
    console.log('new friend online:', email);
  });

  socket.on('newUserOffline', async (email: string) => {

    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);

    data.friends = data.friends.map(obj => {
      if (obj.email === email)
        obj.online = false;
      return obj;
    });

    window.localStorage.setItem('userData', JSON.stringify(data));
    console.log('new friend offline:', email);
  });

  // socket.on('friendsOnline', async (emails: string[]) => {
  //   let localStore = window.localStorage.getItem('userData');
  //   if (!localStore) {
  //     await getInfos();
  //     localStore = window.localStorage.getItem('userData');
  //     if (!localStore) return;
  //   }
  //   const data: IntraData = JSON.parse(localStore);

  //   data.friends = data.friends.map(obj => {
  //     if (emails.indexOf(obj.email) >= 0) {
  //       obj.online = true;
  //       console.log("entro no if", obj);
  //     }
  //     return obj;
  //   });

  //   console.log("novos amigos:", data.friends);
  //   window.localStorage.setItem('userData', JSON.stringify(data));
  //   console.log('friends online:', emails);
  // });

  return socket;

}