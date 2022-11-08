import { Socket } from "socket.io-client";
import { proxy, ref } from "valtio";
import { IntraData } from "../Interfaces/interfaces";
import { getAccessToken } from "../utils/utils";
import {
  createSocketChat,
  CreateSocketChatOptions,
  socketChatIOUrl,
} from "./chat.socket-io";

interface Me {
  name: string;
  id: string;
}

export interface ChatMsg {
  id: string;
  user: IntraData;
  msg: string;
  date: Date;
}

export interface AppStateChat {
  socket?: Socket;
  me: Me | undefined;
  accessToken?: string | null;
  chatMsg?: ChatMsg[] | undefined;
}

const stateChat = proxy<AppStateChat>({
  get me() {
    const localStore = window.localStorage.getItem("userData");
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

const actionsChat = {
  initializeSocketChat: (): void => {
    if (!stateChat.socket) {
      const createSocketOptions: CreateSocketChatOptions = {
        accessToken: getAccessToken(),
        socketChatIOUrl: socketChatIOUrl,
        actionsChat: actionsChat,
        stateChat: stateChat,
      };
      stateChat.socket = ref(createSocketChat(createSocketOptions));
      return;
    }

    if (!stateChat.socket.connected) {
      stateChat.socket.connect();
      return;
    }
  },

  disconnectSocketChat() {
    if (stateChat.socket?.connected) {
      stateChat.socket?.disconnect();
    }
  },

  updateChatMessage(message: ChatMsg) {
    stateChat.chatMsg?.push(message);
  },

  startChatMessage(messageChat:ChatMsg[]) {
    stateChat.chatMsg = messageChat;
  }
};

export type AppActionsChat = typeof actionsChat;

export { stateChat, actionsChat };
