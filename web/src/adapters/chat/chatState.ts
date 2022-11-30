import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { ActiveChatData } from '../../contexts/ChatContext';
import { MsgToClient, MsgToServer } from '../../others/Interfaces/interfaces';
import { getAccessToken, getUserInDb } from '../../others/utils/utils';
import { actionsStatus } from '../status/statusState';
import {
  createSocketChat,
  CreateSocketChatOptions,
  socketChatIOUrl,
} from './chat.socket-io';

export interface AppStateChat {
  socket?: Socket;
  setActiveChat?: Dispatch<SetStateAction<ActiveChatData | null>> | null;
  setUpdateGroup?: Dispatch<SetStateAction<number>>;
}

const stateChat = proxy<AppStateChat>({});

const actionsChat = {
  initializeSocketChat: (
    setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>,
    setUpdateGroup: Dispatch<SetStateAction<number>>
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
      stateChat.setUpdateGroup = ref(setUpdateGroup);
      return;
    }
    if (!stateChat.socket.connected) {
      stateChat.socket.connect();
      stateChat.setActiveChat = ref(setActiveChat);
      stateChat.setUpdateGroup = ref(setUpdateGroup);
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

  joinGroup(id: string, email: string) {
    stateChat.socket?.emit('joinGroup', { id: id, email: email });
  },

  leaveGroup(id: string, email: string) {
    stateChat.socket?.emit('leaveGroup', { id: id, email: email });
  },

  kickMember(id: string, email: string, login: string) {
    stateChat.socket?.emit('kickMember', { id: id, email: email, login: login });
  },

  async msgToServer(message: MsgToServer, type: string) {
    stateChat.socket?.emit('msgToServer', { message: message, type: type });

  },

  async msgToClient(message: MsgToClient, type: string) {
    if (stateChat.setActiveChat) {
      stateChat.setActiveChat((prev: ActiveChatData | null) => {
        if (prev && prev.chat.id === message.chat) {
          const messages: MsgToClient[] = [...prev.historicMsg, message];
          const blocks = Math.floor(messages.length / 20);
          return {
            chat: {
              ...prev.chat,
              messages: messages.slice(-20),
              date: message.date
            },
            newMessage: true,
            historicMsg: messages,
            blocks: blocks,
            currentBlock: blocks - 1,
          };
        }
        return prev;
      });
    }
    if (type === 'direct')
      actionsStatus.updateDirectInfos(message);
    else
      actionsStatus.updateGroupInfos(message);
  },

  async updateGroup() {
    actionsStatus.updateGroup();
    if (stateChat.setUpdateGroup)
      stateChat.setUpdateGroup(Date.now());
  },

  async removeGroup(id: string, login: string) {
    const user = await getUserInDb();
    if (user.login === login) {
      stateChat.socket?.emit('leaveChat', id);
      this.updateGroup();
    }
  },
};

export type AppActionsChat = typeof actionsChat;

export { stateChat, actionsChat };
