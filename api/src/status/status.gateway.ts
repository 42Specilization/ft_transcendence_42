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
import { UserService } from 'src/user/user.service';
import { MapUserData } from './status.class';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'status' })
export class StatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server: Namespace;
  constructor(private readonly userService: UserService) { }
  private logger: Logger = new Logger(StatusGateway.name);

  mapUserData: MapUserData = new MapUserData();

  afterInit() {
    this.logger.log('Status Websocket Gateway initialized.');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of StatusSocket!`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const sockets = this.server.sockets;

    this.newUserOffline(client);
    this.logger.log(`Disconnected of StatusSocket the socket id: ${client.id}`);
    this.logger.debug(`Number of connected StatusSockets: ${sockets.size}`);
  }

  @SubscribeMessage('iAmOnline')
  async newUserOnline(@ConnectedSocket() client: Socket, @MessageBody() login: string) {

    this.mapUserData.set(client.id, login);
    if (this.mapUserData.keyOf(login).length == 1) {
      await this.userService.updateStatus(login, 'online');
      client.broadcast.emit('updateUserStatus', login, 'online');
    }

    this.logger.debug(`iAmOnline => Client: ${client.id}, login: |${login}|`);
  }

  @SubscribeMessage('iAmInGame')
  async newUserInGame(@ConnectedSocket() client: Socket, @MessageBody() login: string) {

    await this.userService.updateStatus(login, 'in a game');
    client.broadcast.emit('updateUserStatus', login, 'in a game');

    this.logger.debug(`iAmInGame => Client: ${client.id}, login: |${login}|`);
  }

  @SubscribeMessage('iAmLeaveGame')
  async newUserLeaveGame(@ConnectedSocket() client: Socket, @MessageBody() login: string) {

    await this.userService.updateStatus(login, 'online');

    client.broadcast.emit('updateUserStatus', login, 'online');

    this.logger.debug(`iAmLeaveGame => Client: ${client.id}, login: |${login}|`);
  }

  async newUserOffline(@ConnectedSocket() client: Socket) {

    const login: string = this.mapUserData.valueOf(client.id);
    if (this.mapUserData.keyOf(login).length == 1) {
      await this.userService.updateStatus(login, 'offline');
      client.broadcast.emit('updateUserStatus', login, 'offline',);
    }
    this.mapUserData.delete(client.id);

    this.logger.debug(`iAmOffline => Client: ${client.id}, email: |${login}|`);
  }

  @SubscribeMessage('changeLogin')
  handleChangeLogin(@ConnectedSocket() client: Socket,
    @MessageBody() newLogin: string) {

    const oldLogin = this.mapUserData.valueOf(client.id);
    this.mapUserData.updateValue(oldLogin, newLogin);

    this.mapUserData.keyOf(newLogin).forEach(socketId =>
      this.server.to(socketId).emit('updateYourselfLogin', newLogin)
    );
    this.mapUserData.keyNotOf(newLogin).forEach(socketId =>
      this.server.to(socketId).emit('updateUserLogin', oldLogin, newLogin)
    );
  }

  @SubscribeMessage('changeImage')
  handleChangeImage(@ConnectedSocket() client: Socket,
    @MessageBody() image_url: string) {

    const login = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId =>
      this.server.to(socketId).emit('updateYourselfImage', image_url)
    );
    this.mapUserData.keyNotOf(login).forEach(socketId =>
      this.server.to(socketId).emit('updateUserImage', login, image_url)
    );
  }

  @SubscribeMessage('newNotify')
  handleNewNotify(@MessageBody() login_target: string) {
    this.mapUserData.keyOf(login_target).forEach(socketId =>
      this.server.to(socketId).emit('updateNotify')
    );
  }

  @SubscribeMessage('removeNotify')
  handleRemoveNotify(@ConnectedSocket() client: Socket) {
    const login = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId =>
      this.server.to(socketId).emit('updateNotify')
    );
  }

  @SubscribeMessage('newFriend')
  handleNewFriend(@ConnectedSocket() client: Socket, @MessageBody() login_target: string) {

    const login: string = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId => {
      this.server.to(socketId).emit('updateFriend');
      this.server.to(socketId).emit('updateNotify');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateFriend');
      });
    }
  }

  @SubscribeMessage('removeFriend')
  handleDeleteFriend(@ConnectedSocket() client: Socket,
    @MessageBody() login_target: string) {

    const login: string = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId => {
      this.server.to(socketId).emit('updateFriend');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateFriend');
      });
    }
  }

  @SubscribeMessage('newBlocked')
  handleNewBlocked(@ConnectedSocket() client: Socket,
    @MessageBody() login_target: string) {

    const login: string = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId => {
      this.server.to(socketId).emit('updateBlocked');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateBlocked');
      });
    }
  }

  @SubscribeMessage('removeBlocked')
  handleREmoveBlocked(@ConnectedSocket() client: Socket,
    @MessageBody() login_target: string) {

    const login: string = this.mapUserData.valueOf(client.id);
    this.mapUserData.keyOf(login).forEach(socketId => {
      this.server.to(socketId).emit('updateBlocked');
    });

    if (this.mapUserData.hasValue(login_target)) {
      this.mapUserData.keyOf(login_target).forEach(socketId => {
        this.server.to(socketId).emit('updateBlocked');
      });
    }
  }



  @SubscribeMessage('newDirect')
  handleNewDirect(
    @MessageBody() { login, chat }: { login: string, chat: string }) {
    if (this.mapUserData.hasValue(login)) {
      this.mapUserData.keyOf(login).forEach(socketId => {
        this.server.to(socketId).emit('updateDirects', chat);
      });
    }
  }

  @SubscribeMessage('changeGroupName')
  handleChangeGroupName(
    @MessageBody() { id, name }: { id: string, name: string }) {
    this.server.emit('updateGroupName', id, name);
    this.server.emit('updateGroupProfile', id);
  }

  @SubscribeMessage('changeGroupImage')
  handleChangeGroupImage(
    @MessageBody() { id, image }: { id: string, image: string }) {
    this.server.emit('updateGroupImage', id, image);
    this.server.emit('updateGroupProfile', id);
  }

  @SubscribeMessage('changeGroupPrivacy')
  handleChangeGroupPrivacy(
    @MessageBody() id: string) {
    this.server.emit('updateGroupPrivacy', id);
    this.server.emit('updateGroupProfile', id);
  }

  @SubscribeMessage('changeGroupAdmins')
  handleChangeGroupAdmins(@MessageBody() id: string) {
    this.server.emit('updateGroupProfile', id);
  }

}