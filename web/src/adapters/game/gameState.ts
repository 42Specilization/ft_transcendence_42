import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { Ball, Rect } from '../../components/Game/Canvas/Canvas';
import { IntraData } from '../../others/Interfaces/interfaces';
import { getAccessToken } from '../../others/utils/utils';
import { createSocket, CreateSocketOptions, socketIOUrl } from './socket-io';

interface Me {
  name: string;
  id: string;
}

export interface Score {
  player1: number;
  player2: number;
}

export interface Player {
  paddle: Rect;
  score: number;
  socketId: string;
  name: string;
}

interface IPosition {
  x: number;
  y: number;
}

export interface IPowerUp {
  position: IPosition;
  itsDrawn: boolean;
}

export interface IPlayerInfos {
  name: string;
  isWithPowerUps: boolean;
}

export interface Game {
  room: number;
  waiting: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  winner: Player;
  msgEndGame: string;
  player1Name: string;
  player2Name: string;
}

export interface AppState {
  socket?: Socket;
  me: Me | undefined;
  accessToken?: string | null;
  isPlayer?: boolean;
  game?: Game;
  ball?: Ball;
  player1?: Player;
  player2?: Player;
  score?: Score;
  powerUp?: IPowerUp;
}

const state = proxy<AppState>({
  get me() {
    const localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      return undefined;
    }
    const data: IntraData = JSON.parse(localStore);
    const myData = {
      name: data.login,
      id: this.socket?.id,
    };
    return myData;
  },
});

const actions = {
  initializeGame: (isWithPowerUps: boolean): void => {
    const playerInfos: IPlayerInfos = {
      isWithPowerUps: isWithPowerUps,
      name: state.me?.name as string
    };
    state.socket?.emit('join-game', playerInfos);
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
  updateBall(ball: Ball) {
    if (!state.ball) {
      state.ball = ball;
    } else {
      state.ball.x = ball.x;
      state.ball.y = ball.y;
      state.ball.radius = ball.radius;
    }
  },
  updatePlayer(player1: Player, player2: Player) {
    if (!state.player1 || !state.player2) {
      state.player1 = player1;
      state.player2 = player2;
    } else {
      state.player1.paddle = player1.paddle;
      state.player2.paddle = player2.paddle;
    }
  },
  updateScore(score: Score) {
    state.score = score;
  },
  updatePowerUp(powerUp: IPowerUp) {
    state.powerUp = powerUp;
  },
  disconnectSocket() {
    if (state.socket?.connected) {
      state.socket?.disconnect();
    }
  },
  leaveGame() {
    state.game = undefined;
    this.disconnectSocket();
  },
  setIsPlayer() {
    if (state.socket && state.game) {
      if (state.socket?.id === state.player1?.socketId
        || state.socket?.id === state.player2?.socketId) {
        state.isPlayer = true;
      } else {
        state.isPlayer = false;
      }
    } else {
      state.isPlayer = false;
    }
  },
};

export type AppActions = typeof actions;

export { state, actions };
