import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { getAccessToken } from '../utils/utils';
import { createSocket, CreateSocketOptions, socketIOUrl } from './socket-io';

interface Me {
  accessToken: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface AppState {
  socket?: Socket;
  me?: Me;
  accessToken?: string | null;
  isPlayer: boolean;
  positionPlayer1: Position;
  positionPlayer2: Position;
}

const state = proxy<AppState>({
  get isPlayer() {
    return (false);
  },
  get positionPlayer1() {
    return ({ x: 100, y: 100 });
  },
  get positionPlayer2() {
    return ({ x: 100, y: 100 });
  }
});

const actions = {
  initializeSocket: (): void => {
    if (!state.socket) {
      const createSocketOptions: CreateSocketOptions = {
        accessToken: getAccessToken(),
        socketIOUrl: socketIOUrl
      };
      state.socket = ref(createSocket(createSocketOptions));
    } else {
      state.socket.connect();
    }
  }
};

export { state, actions };