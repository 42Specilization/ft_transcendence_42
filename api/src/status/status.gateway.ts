/* eslint-disable indent */
import { Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';
import { Server } from 'socket.io';
import { MapUserData, newUserData, UserData } from './status.class';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'status' })
export class StatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server: Namespace;
  @WebSocketServer() io: Server;

  // private server: Namespace;

  private logger: Logger = new Logger(StatusGateway.name);

  mapUserData: MapUserData = new MapUserData();

  afterInit() {
    this.logger.log('Status Websocket Gateway initialized.');
    // this.server = this.io.of('/chat');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of StatusSocket!`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
    // this.mapUserData.debug();
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const sockets = this.server.sockets;

    this.newUserOffline(client);
    this.logger.log(`Disconnected of StatusSocket the socket id: ${client.id}`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
    this.mapUserData.debug();
  }

  @SubscribeMessage('iAmOnline')
  newUserOnline(@ConnectedSocket() client: Socket, @MessageBody() { login, image_url }: { login: string, image_url: string }) {
    const newUser: UserData = newUserData('online', login, image_url);
    this.mapUserData.set(client.id, newUser);

    if (this.mapUserData.keyOf(newUser.login).length == 1) {
      client.broadcast.emit('updateUser', newUser);
    }
    this.logger.debug(`iAmOnline => Client: ${client.id}, email: |${newUser.login}|`);
    this.mapUserData.debug();
  }

  @SubscribeMessage('whoIsOnline')
  whoIsOnline(@ConnectedSocket() client: Socket) {
    client.emit('onlineUsers', Array.from(this.mapUserData.getValues()));
    this.logger.debug(`whoIsOnline => Client: ${client.id}`);
  }

  newUserOffline(@ConnectedSocket() client: Socket) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    user.status = 'offline';

    if (this.mapUserData.keyOf(user.login).length == 1) {
      this.server.emit('updateUser', this.mapUserData.valueOf(client.id));
    }
    this.mapUserData.delete(client.id);

    this.logger.debug(`iAmOffine => Client: ${client.id}, email: |${user.login}|`);
  }


  @SubscribeMessage('changeLogin')
  handleChangeLogin(@ConnectedSocket() client: Socket, @MessageBody() newLogin: string) {
    const oldUser = this.mapUserData.valueOf(client.id);
    const newUser: UserData = newUserData(
      oldUser.status,
      newLogin,
      oldUser.image_url
    );

    this.mapUserData.updateValue(oldUser, newUser);

    this.mapUserData.keyOf(newLogin).forEach(socketId =>
      this.server.to(socketId).emit('updateYourself', newUser)
    );
    this.mapUserData.keyNotOf(newLogin).forEach(socketId =>
      this.server.to(socketId).emit('updateUserLogin', oldUser, newUser)
    );

    // this.io.of('/chat').emit('msgTeste');
    this.mapUserData.debug();
  }

  @SubscribeMessage('changeImage')
  handleChangeImage(@ConnectedSocket() client: Socket, @MessageBody() image_url: string) {
    const oldUser = this.mapUserData.valueOf(client.id);
    const newUser: UserData = newUserData(
      oldUser.status,
      oldUser.login,
      image_url
    );

    this.mapUserData.updateValue(oldUser, newUser);

    this.mapUserData.keyOf(oldUser.login).forEach(socketId =>
      this.server.to(socketId).emit('updateYourself', newUser)
    );
    this.mapUserData.keyNotOf(newUser.login).forEach(socketId =>
      this.server.to(socketId).emit('updateUser', newUser)
    );
  }

  @SubscribeMessage('newNotify')
  handleNewNotify(@ConnectedSocket() client: Socket, @MessageBody() login_target: string) {
    client;
    this.mapUserData.keyOf(login_target).forEach(socketId =>
      this.server.to(socketId).emit('updateNotify')
    );
  }

  @SubscribeMessage('newFriend')
  handleNewFriend(@ConnectedSocket() client: Socket, login_target: string) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    const socketsUser: string[] = this.mapUserData.keyOf(user.login);

    socketsUser.forEach(socketId => {
      this.server.to(socketId).emit('updateFriend');
      this.server.to(socketId).emit('updateNotify');
    });

    if (this.mapUserData.hasValue(login_target)) {
      const socketsFriends: string[] = this.mapUserData.keyOf(login_target);

      socketsFriends.forEach(socketId =>
        this.server.to(socketId).emit('updateFriend')
      );
    }
  }

  @SubscribeMessage('deleteFriend')
  handleDeleteFriend(@ConnectedSocket() client: Socket, @MessageBody() login_target: string) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateRemove');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateRemove');
      });
    }
  }

  @SubscribeMessage('newBlocked')
  handleNewBlocked(@ConnectedSocket() client: Socket) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateBlocked');
    });
  }

  @SubscribeMessage('removeBlocked')
  handleRemoveBlocked(@ConnectedSocket() client: Socket) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateBlocked');
    });
  }

}