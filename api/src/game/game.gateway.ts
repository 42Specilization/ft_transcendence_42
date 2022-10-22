import { BadRequestException, Logger, UseFilters } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'game' })
export class GameGateway implements
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Game Websocket Gateway initialized.');
  }

  handleConnection(user: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`WS user with id: ${user.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  handleDisconnect(user: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected socket id: ${user.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('test')
  async test() {
    throw new BadRequestException(['hohohoh']);
  }

}