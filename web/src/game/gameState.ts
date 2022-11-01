import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { Ball, Rect } from '../components/Canvas/Canvas';
import { IntraData } from '../Interfaces/interfaces';
import { getAccessToken } from '../utils/utils';
import { createSocket, CreateSocketOptions, socketIOUrl } from './socket-io';

interface Me {
  name: string;
}

export interface Player {
  paddle: Rect;
  score: number;
  id: string;
  name: string;
}

export interface Game {
  player1: Player;
  player2: Player;
  watchers: [];
  ball: Ball;
  id: number;
  index: number;
  waiting: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  winner: Player;
}

export interface AppState {
  socket?: Socket;
  me: Me | undefined;
  accessToken?: string | null;
  isPlayer: boolean;
  game?: Game;
  player1: Player;
  player2: Player;
}

const state = proxy<AppState>({
  get isPlayer() {
    if (this.socket && this.game) {
      if (this.socket?.id === state.game?.player1.id
        || this.socket?.id === state.game?.player2.id) {
        return (true);
      } else {
        return (false);
      }
    } else {
      return (false);
    }
  },
  get player1() {
    return (this.game?.player1);
  },
  get player2() {
    return (this.game?.player2);
  },
  get me() {
    const localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      return (undefined);
    }
    const data: IntraData = JSON.parse(localStore);
    const myData = {
      name: data.login
    };
    return (myData);
  }
});

const actions = {
  initializeGame: (): void => {
    state.socket?.emit('join-game', state.me?.name);
  },
  initializeSocket: (): void => {
    if (!state.socket) {
      const createSocketOptions: CreateSocketOptions = {
        accessToken: getAccessToken(),
        socketIOUrl: socketIOUrl,
        actions: actions,
        state: state,
      };
      state.socket = ref(createSocket(createSocketOptions));

      return;
    }

    if (!state.socket.connected) {
      state.socket.connect();
      return;
    }
  },
  updateGame(game?: Game) {
    state.game = game;
  },
  endGame() {
    state.socket?.disconnect();
  },
  destroyGame() {
    this.endGame();
    state.game = undefined;
  }
};

export type AppActions = typeof actions;

export { state, actions };