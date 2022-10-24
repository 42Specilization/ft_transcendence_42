/* eslint-disable indent */
import { Logger, UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  id?: string;
}

export interface Game {
  player1?: Player;
  player2?: Player;
  watchers?: [];
  ball?: Position;
  id: string;
}

const game = {
  player1: {
    position: {
      x: 20,
      y: 200
    },
    id: ''
  },
  player2: {
    position: {
      x: 600,
      y: 200
    },
    id: ''
  }
};
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

    if (game.player1.id === '') {
      game.player1.id = user.id;
      this.logger.debug(`Player one connected socket id: ${user.id}`);
    } else if (game.player2.id === '') {
      game.player2.id = user.id;
      this.logger.debug(`Player two connected socket id: ${user.id}`);
    }//TODO: add watchers

    user.emit('start-game', game);
  }

  handleDisconnect(user: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected socket id: ${user.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('move')
  async move(@MessageBody() direction: string, @ConnectedSocket() client: Socket) {
    this.logger.debug(`Move to ${direction} on Socket id: ${client.id}`);
    let position = game.player1.position;
    if (client.id === game.player2.id) {
      position = game.player2.position;
    }
    switch (direction) {

      case 'left':
        position.x -= 5;
        this.io.emit('update-game', game);
        break;
      case 'right':
        position.x += 5;
        this.io.emit('update-game', game);
        break;
      case 'up':
        position.y -= 5;
        this.io.emit('update-game', game);
        break;
      case 'down':
        position.y += 5;
        this.io.emit('update-game', game);
        break;
    }
  }

}