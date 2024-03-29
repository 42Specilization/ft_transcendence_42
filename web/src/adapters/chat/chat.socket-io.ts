import { io, Socket } from 'socket.io-client';
import { MsgToClient } from '../../others/Interfaces/interfaces';
import { actionsStatus } from '../status/statusState';
import { AppActionsChat, AppStateChat } from './chatState';

export const socketChatIOUrl =
 `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_CHAT_NAMESPACE}`;

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

  socket.on('connect', async () => {
    actionsChat.joinAll();
  });

  socket.on('msgToClient', (message: MsgToClient, type: string) => {
    actionsChat.msgToClient(message, type);
  });

  socket.on('updateGroupChat', () => {
    actionsStatus.updateGroupChat();
  });

  socket.on('updateGroupCommunity', () => {
    actionsStatus.updateGroupCommunity();
  });

  socket.on('updateGroupProfile', (id: string) => {
    actionsStatus.updateGroupProfile(id);
  });

  socket.on('removeGroup', (id: string, login: string) => {
    actionsChat.removeGroup(id, login);
  });

  socket.on('closeGroupProfile', (id: string) => {
    actionsStatus.closeGroupProfile(id);
  });

  return socket;
}
