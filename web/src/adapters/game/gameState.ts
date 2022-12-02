import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { Ball, Rect } from '../../components/Game/Canvas/Canvas';
import { getAccessToken } from '../../others/utils/utils';
import { createSocket, CreateSocketOptions, socketIOUrl } from './socket-io';

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

export interface IChallenge {
  userTarget: string;
  userSource: string;
  isWithPowerUps: boolean;
  room: number;
}

export interface AppState {
  socket?: Socket;
  name?: string;
  accessToken?: string | null;
  isPlayer?: boolean;
  game?: Game;
  ball?: Ball;
  player1?: Player;
  player2?: Player;
  score?: Score;
  powerUp?: IPowerUp;
  serverError?: boolean;
  errorToConnect?: boolean;
}

const state = proxy<AppState>();

const actions = {
  initializeGame: (isWithPowerUps: boolean): void => {
    if (state.errorToConnect !== undefined && !state.errorToConnect) {
      return;
    }
    const playerInfos: IPlayerInfos = {
      isWithPowerUps: isWithPowerUps,
      name: state.name as string
    };
    state.socket?.emit('join-game', playerInfos);
  },
  initializeSocket: (): Socket | void => {
    if (!state.socket) {
      const createSocketOptions: CreateSocketOptions = {
        accessToken: getAccessToken(),
        socketIOUrl: socketIOUrl,
        actions: actions,
        state: state,
      };
      state.socket = ref(createSocket(createSocketOptions));
      return (state.socket);
    }

    if (!state.socket.connected) {
      state.socket.connect();
      return;
    }
  },
  challengeFriend(nick: string, isWithPowerUps: boolean) {
    if (state.errorToConnect !== undefined && !state.errorToConnect) {
      return;
    }
    const challengeInfos: IChallenge = {
      isWithPowerUps: isWithPowerUps,
      userSource: state.name as string,
      userTarget: nick,
      room: -1
    };
    state.socket?.emit('challenge', challengeInfos);
  },
  acceptChallenge(room: number, userSource: string, userTarget: string) {
    if (state.errorToConnect !== undefined && !state.errorToConnect) {
      return;
    }
    const challengeInfos: IChallenge = {
      isWithPowerUps: false,
      userSource: userSource,
      userTarget: userTarget,
      room: room
    };
    state.socket?.emit('accept-challenge', challengeInfos);
  },
  rejectChallenge(room: string) {
    if (state.errorToConnect !== undefined && !state.errorToConnect) {
      return;
    }
    state.socket?.emit('reject-challenge', room);
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
    if (state.game) {
      state.game.hasEnded = true;
      state.game.msgEndGame = 'You have been disconnected!';
    }
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
  updateServerError(serverError: boolean) {
    state.serverError = serverError;
    this.leaveGame();
  },
  updateName(name: string) {
    state.name = name;
  }
};

export type AppActions = typeof actions;

export { state, actions };
