/* eslint-disable indent */

import { Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';
import { MapStatus } from './status.class';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'status' })
export class StatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Namespace;
  private logger: Logger = new Logger(StatusGateway.name);

  usersOnline: MapStatus = new MapStatus();

  afterInit() {
    this.logger.log('Status Websocket Gateway initialized.');
  }

  handleConnection(client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of StatusSocket!`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.sockets;

    this.newUserOffline(client);
    this.logger.log(`Disconnected of StatusSocket the socket id: ${client.id}`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
  }

  @SubscribeMessage('iAmOnline')
  newUserOnline(client: Socket, email: string) {
    this.usersOnline.set(client.id, email);
    this.logger.debug(`keys: ${this.usersOnline.keyOf(email)}, values: |${this.usersOnline.valueOf(client.id)}|`);
    if (this.usersOnline.keyOf(email).length > 1) {
      client.emit('friendsOnline', Array.from(this.usersOnline.getValues()));
      return;
    }
    client.broadcast.emit('newUserOnline', email);
    client.emit('friendsOnline', Array.from(this.usersOnline.getValues()));
    this.server.emit('change');

    this.logger.debug(`iAmOnline => Client: ${client.id}, email: |${email}|`);
  }


  newUserOffline(client: Socket) {
    const email = this.usersOnline.valueOf(client.id);
    if (this.usersOnline.keyOf(email).length == 1)
      this.server.emit('newUserOffline', this.usersOnline.valueOf(client.id));
    this.usersOnline.delete(client.id);
    this.server.emit('change');

    this.logger.debug(`iAmOffine => Client: ${client.id}, email: |${email}|`);
  }
}