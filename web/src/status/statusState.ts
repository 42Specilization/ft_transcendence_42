import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { IntraData } from '../Interfaces/interfaces';
import { getAccessToken } from '../utils/utils';
import {
  createSocketStatus,
  CreateSocketStatusOptions,
  socketStatusIOUrl,
} from './status.socket-io';

interface Me {
  id: string;
  name: string;
  email: string;
}

export interface AppStateStatus {
  socket?: Socket;
  me: Me | undefined;
  accessToken?: string | null;
}

const stateStatus = proxy<AppStateStatus>({
  get me() {
    const localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      return undefined;
    }
    const data: IntraData = JSON.parse(localStore);
    const myData: Me = {
      id: this.socket ? this.socket.id : '',
      name: data.login,
      email: data.email,
    };
    return myData;
  },
});

const actionsStatus = {
  initializeSocketStatus: (): void => {
    if (!stateStatus.socket) {

      const createSocketOptions: CreateSocketStatusOptions = {
        accessToken: getAccessToken(),
        socketStatusIOUrl: socketStatusIOUrl,
        actionsStatus: actionsStatus,
        stateStatus: stateStatus,
      };
      stateStatus.socket = ref(createSocketStatus(createSocketOptions));
      return;
    }

    if (!stateStatus.socket.connected) {
      stateStatus.socket.connect();
      stateStatus.socket.emit('iAmOnline', stateStatus.me?.email);
      return;
    }
  },

  disconnectSocketStatus() {
    if (stateStatus.socket?.connected) {
      stateStatus.socket?.disconnect();
    }
  },

};

export type AppActionsStatus = typeof actionsStatus;

export { stateStatus, actionsStatus };
