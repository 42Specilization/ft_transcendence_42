import { io, Socket } from "socket.io-client";
import { AppActionsChat, AppStateChat } from "./chatState";

export const socketChatIOUrl = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
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
  stateChat,
}: CreateSocketChatOptions): Socket {
  const socket = io(socketChatIOUrl, {
    auth: {
      token: accessToken,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => console.log("user connected", stateChat.me?.name));

  return socket;
}
