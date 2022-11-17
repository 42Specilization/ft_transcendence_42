import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { DirectChatData, DirectData, IntraData, MsgToClient, MsgToServer } from '../Interfaces/interfaces';
import { getAccessToken } from '../utils/utils';
import {
  createSocketChat,
  CreateSocketChatOptions,
  socketChatIOUrl,
} from './chat.socket-io';

interface Me {
  id: string | undefined;
  name: string;
}

export interface AppStateChat {
  socket?: Socket;
  me: Me | undefined;
  accessToken?: string | null;
  setActiveChat?: Dispatch<SetStateAction<DirectChatData | null>> | null;
  setChatList?: Dispatch<SetStateAction<DirectData[] | []>> | null;
}

const stateChat = proxy<AppStateChat>({
  get me() {
    const localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      return undefined;
    }
    const data: IntraData = JSON.parse(localStore);
    const myData: Me = {
      id: this.socket?.id,
      name: data.login,
    };
    return myData;
  },
});

const actionsChat = {
  initializeSocketChat: (setActiveChat: Dispatch<SetStateAction<DirectChatData | null>>): void => {
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

  setChatList(setChatList: Dispatch<SetStateAction<DirectChatData[] | []>>) {
    stateChat.setChatList = ref(setChatList);
  },

  joinChat(id: string) {
    stateChat.socket?.emit('joinChat', id);
  },

  leaveChat(id: string) {
    stateChat.socket?.emit('leaveChat', id);
  },

  msgToServer(message: MsgToServer) {
    stateChat.socket?.emit('msgToServer', message);
  },

  msgToClient(message: MsgToClient) {
    if (stateChat.setActiveChat) {
      stateChat.setActiveChat((prev) => {
        if (prev && prev.id === message.chat) {
          if (prev.messages)
            return { ...prev, messages: [...prev.messages, message], date: message.date };
          return { ...prev, messages: [message], date: message.date};
        }
        return null;
      });
      if(stateChat.setChatList) {
        stateChat.setChatList((prev) => {
          if (prev){
            return prev.map((key) => {
              console.log('key', key)
              if ( key.id === message.chat) 
                return { ...key, date: message.date };
              return key;
            });
          }
          return [];
        });
      }
    }
  },



};

export type AppActionsChat = typeof actionsChat;

export { stateChat, actionsChat };
