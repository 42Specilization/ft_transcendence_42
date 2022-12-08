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
}

const stateChat = proxy<AppStateChat>({});

const actionsChat = {
  initializeSocketChat: (
    setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>
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

  JoinNewGroup(id: string, email: string) {
    stateChat.socket?.emit('joinNewGroup', { id: id, email: email });
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

  banMember(id: string, email: string, login: string) {
    stateChat.socket?.emit('banMember', { id: id, email: email, login: login });
  },

  removeBanMember(id: string, email: string, login: string) {
    stateChat.socket?.emit('removeBanMember', { id: id, email: email, login: login });
  },

  muteMember(id: string, email: string, login: string) {
    stateChat.socket?.emit('muteMember', { id: id, email: email, login: login });
  },

  unmuteMember(id: string, email: string, login: string) {
    stateChat.socket?.emit('unmuteMember', { id: id, email: email, login: login });
  },

  async msgToServer(message: MsgToServer, type: string) {
    stateChat.socket?.emit('msgToServer', { message: message, type: type });
  },

  async msgToClient(message: MsgToClient, type: string) {
    if (stateChat.setActiveChat) {
      stateChat.setActiveChat((prev: ActiveChatData | null) => {
        if (prev && prev.chat.id === message.chat) {
          const messages: MsgToClient[] = [...prev.historicMsg, message];
          return {
            chat: {
              ...prev.chat,
              messages: messages.slice(-30),
              date: message.date
            },
            newMessage: true,
            historicMsg: messages,
            currentMessage: messages.length - 1,
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

  async removeGroup(id: string, login: string) {
    const user = await getUserInDb();
    if (user.login === login) {
      stateChat.socket?.emit('leaveChat', id);
    }
    actionsStatus.updateGroupChat();
  },
};

export type AppActionsChat = typeof actionsChat;

export { stateChat, actionsChat };
