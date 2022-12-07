import axios from 'axios';
import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { Ball, Rect } from '../../components/Game/Canvas/Canvas';
import { NotifyData } from '../../others/Interfaces/interfaces';
import { getAccessToken } from '../../others/utils/utils';
import { actionsStatus } from '../status/statusState';
import { createSocket, CreateSocketOptions, socketIOUrl } from './game-socket-io';

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
  challengeNotify?: NotifyData
}

const stateGame = proxy<AppState>();

const actionsGame = {
  initializeGame: (isWithPowerUps: boolean): void => {
    if (stateGame.errorToConnect !== undefined && !stateGame.errorToConnect) {
      return;
    }
    const playerInfos: IPlayerInfos = {
      isWithPowerUps: isWithPowerUps,
      name: stateGame.name as string
    };
    stateGame.socket?.emit('join-game', playerInfos);
  },
  initializeSocket: (): Socket | void => {
    if (!stateGame.socket) {
      const createSocketOptions: CreateSocketOptions = {
        accessToken: getAccessToken(),
        socketIOUrl: socketIOUrl,
        actionsGame: actionsGame,
        stateGame: stateGame,
      };
      stateGame.socket = ref(createSocket(createSocketOptions));
      return (stateGame.socket);
    }

    if (!stateGame.socket.connected) {
      stateGame.socket.connect();
      return (stateGame.socket);
    }
    return (stateGame.socket);
  },
  updateChallengeNotify(notify: NotifyData) {
    stateGame.challengeNotify = notify;
  },
  async cancelChallengeNotify() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await axios.patch(`http://${import.meta.env.VITE_API_HOST}:3000/user/removeNotify`, { id: 0, notify: stateGame.challengeNotify }, config);
    actionsStatus.removeNotify(stateGame.challengeNotify?.user_target_email);
  },
  challengeFriend(nick: string, isWithPowerUps: boolean) {
    if (stateGame.errorToConnect !== undefined && !stateGame.errorToConnect) {
      return;
    }
    const challengeInfos: IChallenge = {
      isWithPowerUps: isWithPowerUps,
      userSource: stateGame.name as string,
      userTarget: nick,
      room: -1
    };
    stateGame.socket?.emit('challenge', challengeInfos);
  },
  acceptChallenge(room: number, userSource: string, userTarget: string) {
    if (stateGame.errorToConnect !== undefined && !stateGame.errorToConnect) {
      return;
    }
    const challengeInfos: IChallenge = {
      isWithPowerUps: false,
      userSource: userSource,
      userTarget: userTarget,
      room: room
    };
    stateGame.socket?.emit('accept-challenge', challengeInfos);
  },
  rejectChallenge(room: string) {
    if (stateGame.errorToConnect !== undefined && !stateGame.errorToConnect) {
      return;
    }
    stateGame.socket?.emit('reject-challenge', room);
  },
  updateGame(game?: Game) {
    stateGame.game = game;
  },
  updateBall(ball: Ball) {
    if (!stateGame.ball) {
      stateGame.ball = ball;
    } else {
      stateGame.ball.x = ball.x;
      stateGame.ball.y = ball.y;
      stateGame.ball.radius = ball.radius;
    }
  },
  updatePlayer(player1: Player, player2: Player) {
    if (!stateGame.player1 || !stateGame.player2) {
      stateGame.player1 = player1;
      stateGame.player2 = player2;
    } else {
      stateGame.player1.paddle = player1.paddle;
      stateGame.player2.paddle = player2.paddle;
    }
  },
  updateScore(score: Score) {
    stateGame.score = score;
  },
  updatePowerUp(powerUp: IPowerUp) {
    stateGame.powerUp = powerUp;
  },
  disconnectSocket() {
    if (stateGame.socket?.connected) {
      stateGame.socket?.disconnect();
    }
  },
  leaveGame() {
    if (stateGame.game) {
      stateGame.game.hasEnded = true;
      stateGame.game.msgEndGame = 'You have been disconnected!';
    }
    this.disconnectSocket();
  },
  setIsPlayer() {
    if (stateGame.socket && stateGame.game) {
      if (stateGame.socket?.id === stateGame.player1?.socketId
        || stateGame.socket?.id === stateGame.player2?.socketId) {
        stateGame.isPlayer = true;
      } else {
        stateGame.isPlayer = false;
      }
    } else {
      stateGame.isPlayer = false;
    }
  },
  updateServerError(serverError: boolean) {
    stateGame.serverError = serverError;
    this.leaveGame();
  },
  updateName(name: string) {
    stateGame.name = name;
  }
};

export type AppActions = typeof actionsGame;

export { stateGame, actionsGame };
