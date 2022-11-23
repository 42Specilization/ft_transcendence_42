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

  handleConnection(@ConnectedSocket() client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of StatusSocket!`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
    this.mapUserData.debug();
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
      client.broadcast.emit('updateUserStatus', newUser);
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
      this.server.emit('updateUserStatus', this.mapUserData.valueOf(client.id));
    }
    this.mapUserData.delete(client.id);

    this.logger.debug(`iAmOffine => Client: ${client.id}, email: |${user.login}|`);
  }


  @SubscribeMessage('changeLogin')
  handleChangeLogin(@ConnectedSocket() client: Socket,
    @MessageBody() newLogin: string) {
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

    this.mapUserData.debug();
  }

  @SubscribeMessage('changeImage')
  handleChangeImage(@ConnectedSocket() client: Socket,
    @MessageBody() image_url: string) {
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
      this.server.to(socketId).emit('updateUserImage', newUser)
    );
  }

  @SubscribeMessage('newNotify')
  handleNewNotify(@MessageBody() login_target: string) {
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

  @SubscribeMessage('removeFriend')
  handleDeleteFriend(@ConnectedSocket() client: Socket,
    @MessageBody() login_target: string) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateFriend');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateFriend');
      });
    }
  }

  @SubscribeMessage('blockFriend')
  handleBlockFriend(@ConnectedSocket() client: Socket,
    @MessageBody() login_target: string) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateFriendBlocked');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateFriend');
      });
    }
  }

  @SubscribeMessage('updateBlocked')
  handleUpdateBlocked(@ConnectedSocket() client: Socket) {
    const user: UserData = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(user.login).forEach(socketId => {
      this.server.to(socketId).emit('updateBlocked');
    });
  }

  @SubscribeMessage('newDirect')
  handleNewDirect(@MessageBody() { name, chat }: { name: string, chat: string }) {
    if (this.mapUserData.hasValue(name)) {
      this.mapUserData.keyOf(name).forEach(socketId => {
        this.server.to(socketId).emit('updateDirect', chat);
      });
    }
  }
}