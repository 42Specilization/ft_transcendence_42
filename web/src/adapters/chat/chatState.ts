import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { DirectData, MsgToClient, MsgToServer } from '../../others/Interfaces/interfaces';
import { getAccessToken, getUserInDb } from '../../others/utils/utils';
import { actionsStatus } from '../status/statusState';
import {
  createSocketChat,
  CreateSocketChatOptions,
  socketChatIOUrl,
} from './chat.socket-io';

export interface AppStateChat {
  socket?: Socket;
  setActiveChat?: Dispatch<SetStateAction<DirectData | null>> | null;
}

const stateChat = proxy<AppStateChat>({});

const actionsChat = {
  initializeSocketChat: (setActiveChat:
    Dispatch<SetStateAction<DirectData | null>>
  ): void => {

    if (!stateChat.socket) {
      const createSocketOptions: CreateSocketChatOptions = {
        accessToken: getAccessToken(),
        socketChatIOUrl: socketChatIOUrl,
        actionsChat: actionsChat,
        stateChat: stateChat,
      };
      stateChat.socket = ref(createSocketChat(createSocketOptions));
      stateChat.setActiveChat = ref(setActiveChat);
      return;
    }
    if (!stateChat.socket.connected) {
      stateChat.socket.connect();
      stateChat.setActiveChat = ref(setActiveChat);
      return;
    }
  },

  disconnectSocketChat() {
    if (stateChat.socket?.connected) {
      stateChat.socket?.disconnect();
    }
  },

  async joinAll() {
    const user = await getUserInDb();
    stateChat.socket?.emit('joinAll', user.login);
  },

  joinChat(id: string) {
    stateChat.socket?.emit('joinChat', id);
  },

  leaveChat(id: string) {
    stateChat.socket?.emit('leaveChat', id);
  },

  msgToServer(message: MsgToServer, type: string) {
    stateChat.socket?.emit('msgToServer', { message: message, type: type });
  },

  async msgToClient(message: MsgToClient) {
    if (stateChat.setActiveChat) {
      stateChat.setActiveChat((prev: DirectData | null) => {
        if (prev && prev.id === message.chat) {
          if (prev.messages)
            return { ...prev, messages: [...prev.messages, message], date: message.date };
          return { ...prev, messages: [message], date: message.date };
        }
        return prev;
      });
    }
    actionsStatus.updateDirectInfos(message);
  },
};

export type AppActionsChat = typeof actionsChat;

export { stateChat, actionsChat };
