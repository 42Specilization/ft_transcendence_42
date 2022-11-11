import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { IntraData } from '../Interfaces/interfaces';
import { getInfos } from '../pages/OAuth/OAuth';
import { getAccessToken } from '../utils/utils';
import {
  createSocketStatus,
  CreateSocketStatusOptions,
  socketStatusIOUrl,
  UserOnline,
} from './status.socket-io';

interface Me {
  id: string;
  login: string;
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
      login: data.login,
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
      stateStatus.socket.emit('iAmOnline', stateStatus.me?.login);
      return;
    }
  },

  disconnectSocketStatus() {
    if (stateStatus.socket?.connected) {
      stateStatus.socket?.disconnect();
    }
  },

  async updateFriendsOnline(friends: UserOnline[]) {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);

    data.friends = data.friends.map(friend => {
      if (friends.map(e => e.login).indexOf(friend.login) >= 0)
        friend.status = 'online';
      return friend;
      //PENSAR NO STATUS DE JOGANDO
    });

    window.localStorage.setItem('userData', JSON.stringify(data));
  },

  async updateUserStatus(user: UserOnline) {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);

    data.friends = data.friends.map(friend => {
      if (user.login === friend.login)
        friend.status = user.status;
      return friend;
    });

    window.localStorage.setItem('userData', JSON.stringify(data));
  },

  async updateUser(oldUser: UserOnline, newUser: UserOnline) {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);

    data.friends = data.friends.map(friend => {
      if (oldUser.login === friend.login)
        friend.login = newUser.login;
      return friend;
    });

    window.localStorage.setItem('userData', JSON.stringify(data));
  },

  async updateYourSelf(user: UserOnline) {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore) return;
    }
    const data: IntraData = JSON.parse(localStore);
    data.login = user.login;
    window.localStorage.setItem('userData', JSON.stringify(data));
  },

};

export type AppActionsStatus = typeof actionsStatus;

export { stateStatus, actionsStatus };
