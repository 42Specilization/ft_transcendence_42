import { io, Socket } from 'socket.io-client';

export const socketIOUrl =
  `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_GAME_NAMESPACE}`;

export interface CreateSocketOptions {
  accessToken?: string | undefined | null;
  socketIOUrl: string;
}

export function createSocket({ accessToken, socketIOUrl }: CreateSocketOptions): Socket {
  console.log('Creating socket with accessToken: ', accessToken);

  const socket = io(socketIOUrl, {
    auth: {
      token: accessToken
    },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('Connected with socked ID: ', socket.id);
  });

  return (socket);
}