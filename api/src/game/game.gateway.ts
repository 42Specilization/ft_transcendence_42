/* eslint-disable indent */
import { Logger, UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { randomInt } from 'crypto';
import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';
import { Game } from './game.class';

interface IMove {
  direction: string;
  index: number;
}

/**
 * Web Socket configuration of the game pong.
 * The game socket has filters exceptions and authentication with jwt.
 */
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'game' })
export class GameGateway implements
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer() io: Namespace;

  queue: Game[] = [];

  /**
   * Function called when the socket start
   */
  afterInit(): void {
    this.logger.log('Game Websocket Gateway initialized.');
  }

  /**
   * This function checks if the queue array there is a game without a player,
   * if this is the case so the coming player will enter in this game.
   * Otherwise another instance of game will be create on queue and this player will stay there waiting for another player.
   * @returns index of the game on queue array.
   */
  checkGameArray(): number {
    if (this.queue.length > 0) {
      for (let i = 0; i < this.queue.length; i++) {
        if (this.queue[i].player1.id === '' || this.queue[i].player2.id === '')
          return (i);
      }
    }
    this.queue.push(new Game(
      randomInt(100),
      this.queue.length - 1 > 0 ?
        this.queue.length - 1 : this.queue.length
    ));
    return (this.queue.length - 1);
  }

  /**
   * Always when someone connected the socket this function will be send.
   * @param user Socket of the connected player.
   */
  handleConnection(user: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`WS user with id: ${user.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);



  }

  /**
   * This function will check which instance of the game on queue this player was.
   * After that this instance will be removed.
   * This way the game will be finished.
   * 
   * @param id Socket id of the disconnected player
   */
  finishGame(id: string) {
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].player1.id === id || this.queue[i].player2.id === id) {
        this.io.to(this.queue[i].id.toString()).emit('end-game', 'send who is the winner');
        delete this.queue[i];
        this.queue.splice(i, 1);
        break;
      }
    }
  }

  /**
   * This function is called always when someone left the socket game.
   * The game were the player was will be finished.
   * @param user Socket of the user disconnected.
   */
  handleDisconnect(user: Socket) {
    const sockets = this.io.sockets;
    //TODO: Save game instance on db to use on historic
    this.finishGame(user.id);

    this.logger.log(`Disconnected socket id: ${user.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  /**
   * This function get the instance of the a game on queue array.
   * After that will verify which player is missing and add the socket id there.
   * The user will enter a room with the gameId.
   * @param user Socket of the user player.
   */
  @SubscribeMessage('join-game')
  async joinGame(@ConnectedSocket() user: Socket, @MessageBody() name: string) {
    const index = this.checkGameArray();
    if (this.queue[index].player1.id === '') {
      this.queue[index].player1.id = user.id;
      this.queue[index].player1.name = name;
      user.join(this.queue[index].id.toString());
      this.io.to(this.queue[index].id.toString()).emit('start-game', this.queue[index]);
      this.logger.debug(`Player one connected socket id: ${user.id} Game index:${index} Game id:${this.queue[index].id}`);
    } else if (this.queue[index].player2.id === '') {
      this.queue[index].player2.id = user.id;
      this.queue[index].player2.name = name;
      user.join(this.queue[index].id.toString());
      this.logger.debug(`Player two connected socket id: ${user.id} Game index:${index} Game id:${this.queue[index].id}`);
      this.queue[index].hasStarted = true;
      this.queue[index].waiting = false;
      this.io.to(this.queue[index].id.toString()).emit('start-game', this.queue[index]);
    }//TODO: add watchers
  }

  /**
   * This function will be called always when a move emit is received.
   * This will check which player and instance game is and move the player.
   * After the movement an update-game event will be send with the instance of the game.
   * @param move Move object with the direction and game index of the player.
   * @param client The player socket
   */
  @SubscribeMessage('move')
  async move(@MessageBody() move: IMove, @ConnectedSocket() client: Socket) {

    const direction = move.direction;
    const game = this.queue[move.index];
    this.logger.debug(`Move to ${direction} on Socket id: ${client.id} Game index:${move.index} Game id:${game.id}`);

    let position = game.player1.paddle;
    if (client.id === game.player2.id) {
      position = game.player2.paddle;
    }
    switch (direction) {
      case 'up':
        position.y -= 5;
        this.io.to(game.id.toString()).emit('update-game', game);
        break;
      case 'down':
        position.y += 5;
        this.io.to(game.id.toString()).emit('update-game', game);
        break;
    }
  }

  @SubscribeMessage('update-ball')
  async update(@MessageBody() index: number) {
    const game = this.queue[index];
    game.update();
    if (game.checkWinner()) {
      this.io.to(game.id.toString()).emit('end-game', game);
    } else {
      this.io.to(game.id.toString()).emit('update-ball', game);
    }
  }

}

