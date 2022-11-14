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
import { MapUserData, newUserData, UserData } from './status.class';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'status' })
export class StatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Namespace;
  private logger: Logger = new Logger(StatusGateway.name);

  mapUserData: MapUserData = new MapUserData();

  afterInit() {
    this.logger.log('Status Websocket Gateway initialized.');
  }

  handleConnection(client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of StatusSocket!`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
    this.mapUserData.debug();
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.sockets;

    this.newUserOffline(client);
    this.logger.log(`Disconnected of StatusSocket the socket id: ${client.id}`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
    this.mapUserData.debug();
  }

  @SubscribeMessage('iAmOnline')
  newUserOnline(client: Socket, { login, image_url }: { login: string, image_url: string }) {
    const newUser: UserData = newUserData('online', login, image_url);
    this.mapUserData.set(client.id, newUser);
    client.emit('loggedUsers', Array.from(this.mapUserData.getValues()));
    client.emit('getUserNotification', login);
    if (this.mapUserData.keyOf(newUser.login).length == 1) {
      client.broadcast.emit('updateUser', newUser);
      this.server.emit('change');
      this.server.emit('changeAny');
    } else {
      client.emit('change');
    }

    this.logger.debug(`iAmOnline => Client: ${client.id}, email: |${newUser.login}|`);
    this.mapUserData.debug();
  }


  newUserOffline(client: Socket) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    user.status = 'offline';

    if (this.mapUserData.keyOf(user.login).length == 1) {
      this.server.emit('updateUser', this.mapUserData.valueOf(client.id));
      this.server.emit('change');
    }
    this.mapUserData.delete(client.id);

    this.logger.debug(`iAmOffine => Client: ${client.id}, email: |${user.login}|`);
  }


  @SubscribeMessage('changeLogin')
  handleChangeLogin(client: Socket, newLogin: string) {
    const oldUser = this.mapUserData.valueOf(client.id);
    const newUser: UserData = newUserData(
      oldUser.status,
      newLogin,
      oldUser.image_url
    );

    this.mapUserData.debug();

    this.mapUserData.updateValue(oldUser, newUser);
    this.mapUserData.keyOf(newLogin).forEach(socketId =>
      this.server.to(socketId).emit('updateYourself', newUser)
    );
    // client.broadcast.emit('updateUserLogin', oldUser, newUser);

    this.mapUserData.debug();

    // client.broadcast.emit('change');
  }

  @SubscribeMessage('changeNotify')
  handleChangeNotify(client: Socket, login_target: string) {
    client;
    this.mapUserData.keyOf(login_target).forEach(socketId =>
      this.server.to(socketId).emit('changeNotify')
    );
  }

}