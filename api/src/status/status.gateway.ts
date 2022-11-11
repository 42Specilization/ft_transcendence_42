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
import { MapStatus, UserOnline } from './status.class';

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
  newUserOnline(client: Socket, login: string) {
    const newUser: UserOnline = {
      status: 'online',
      login: login,
    };
    this.usersOnline.set(client.id, newUser);
    this.logger.debug(`keys: ${this.usersOnline.keyOf(newUser.login)}, values: |${this.usersOnline.valueOf(client.id)}|`);
    client.emit('friendsOnline', Array.from(this.usersOnline.getValues()));
    if (this.usersOnline.keyOf(newUser.login).length > 1) {
      return;
    }
    client.broadcast.emit('updateUserStatus', newUser);
    this.server.emit('change');

    this.logger.debug(`iAmOnline => Client: ${client.id}, email: |${newUser.login}|`);
  }


  newUserOffline(client: Socket) {
    const user: UserOnline = this.usersOnline.valueOf(client.id);
    user.status = 'offline';
    this.usersOnline.set(client.id, user);
    if (this.usersOnline.keyOf(user.login).length == 1)
      this.server.emit('updateUserStatus', this.usersOnline.valueOf(client.id));
    this.usersOnline.delete(client.id);
    this.server.emit('change');

    this.logger.debug(`iAmOffine => Client: ${client.id}, email: |${user.login}|`);
  }


  @SubscribeMessage('changeLogin')
  handleChangeLogin(client: Socket, newLogin: string) {
    const oldUser = this.usersOnline.valueOf(client.id);
    const newUser = {
      status: oldUser.status,
      login: newLogin,
    };
    this.usersOnline.updateValue(client.id, oldUser, newUser);
    client.emit('updateYourself', newUser);
    client.broadcast.emit('updateUser', oldUser, newUser);

    this.server.emit('change');
  }




}