import { Socket } from 'socket.io';
import { UserPayload } from '../../auth/dto/UserPayload.dto';

export type SocketWithAuth = Socket & UserPayload;