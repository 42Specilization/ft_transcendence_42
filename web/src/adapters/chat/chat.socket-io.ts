import { io, Socket } from 'socket.io-client';
import { MsgToClient } from '../../others/Interfaces/interfaces';
import { AppActionsChat, AppStateChat } from './chatState';

export const socketChatIOUrl = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT
}/${import.meta.env.VITE_CHAT_NAMESPACE}`;

export interface CreateSocketChatOptions {
  accessToken?: string | undefined | null;
  socketChatIOUrl: string;
  stateChat: AppStateChat;
  actionsChat: AppActionsChat;
}

export function createSocketChat({
  accessToken,
  socketChatIOUrl,
  actionsChat,
}: CreateSocketChatOptions): Socket {
  const socket = io(socketChatIOUrl, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket', 'polling'],
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  socket.on('connect', async () => {
    actionsChat.joinAll();
  });

  socket.on('msgToClient', (message: MsgToClient) => {
    actionsChat.msgToClient(message);
    // console.log('msg to client:', message);
  });

  return socket;
}
