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
import { randomInt } from 'crypto';
import { Socket, Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/socket/exceptions/ws-catch-all-filter';
import { WsBadRequestException } from 'src/socket/exceptions/ws-exceptions';
import { Game } from './game.class';

interface IMove {
  direction: string;
  room: number;
}

/**
 * Web Socket configuration of the game pong.
 * The game socket has filters exceptions and authentication with jwt.
 */
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'game' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer() io: Namespace;

  queue: Game[] = [];

  afterInit(): void {
    this.logger.log('Game Websocket Gateway initialized.');
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
   * This function is called always when someone left the socket game.
   * The game were the player was will be finished.
   * @param user Socket of the user disconnected.
   */
  handleDisconnect(user: Socket) {
    const sockets = this.io.sockets;
    //TODO: Save game instance on db to use on historic
    this.finishGame(user);
    this.logger.log(`Disconnected socket id: ${user.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  /**
   * This function get the instance of the a game on queue array.
   * After that will verify which player is missing and add the socket id there.
   * The user will enter a room with the game room.
   * When the second player enter the server will emit all information necessary to game start the game, and emit the event of game list.
   * @param user Socket of the user player.
   */
  @SubscribeMessage('join-game')
  async joinGame(@ConnectedSocket() user: Socket, @MessageBody() name: string) {
    const index = this.checkGameArray();
    const game = this.queue[index];
    if (game.player1.socketId === '') {
      game.player1.socketId = user.id;
      game.player1.name = name;
      user.join(game.room.toString());
      this.io
        .to(game.room.toString())
        .emit('update-game', game.getGameDto());
      this.logger.debug(
        `Player one connected name: ${name} socket id:${user.id} Game room:${game.room}`
      );
    } else if (game.player2.socketId === '') {
      game.player2.socketId = user.id;
      game.player2.name = name;
      user.join(game.room.toString());
      this.logger.debug(
        `Player two connected name: ${name} socket id:${user.id} Game room:${game.room}`
      );
      game.hasStarted = true;
      game.waiting = false;
      this.sendUpdatesEmits(game);
      this.io
        .to(game.room.toString())
        .emit('start-game', game);
      this.sendGameList();
    }
  }

  /**
   * This function will be called always when a move emit is received.
   * This will check which player and instance game is and move the player.
   * This also will check if the user is a player, and if has paddle collision.
   * After the movement an update-player event will be send with the data of the players.
   * @param move Move object with the direction and game room of the player.
   * @param user The player socket
   */
  @SubscribeMessage('move')
  async move(@MessageBody() move: IMove, @ConnectedSocket() user: Socket) {
    const direction = move.direction;

    const game = this.getGameByRoom(move.room);
    if (!game) {
      return;
    }
    if (!this.isPlayer(game, user)) {
      return;
    }
    let player = game.player1;
    if (user.id === game.player2.socketId) {
      player = game.player2;
    }

    if (game.isPaddleCollision(player.paddle, direction)) {
      return;
    }

    switch (direction) {
      case 'up':
        player.paddle.y -= 5;
        this.io.to(game.room.toString()).emit('update-player', game.player1, game.player2);
        break;
      case 'down':
        player.paddle.y += 5;
        this.io.to(game.room.toString()).emit('update-player', game.player1, game.player2);
        break;
    }
  }

  /**
   * This function will call the update game function and emit the update-ball event.
   * If the game has a winner, will emit an end-game event.
   * If a user receive a score point, will emit an update-score event.
   * All of this will be checked only if the user is a player, and if is the player one.
   * @param room Room of the game.
   * @param user The player socket.
   */
  @SubscribeMessage('update-ball')
  async update(@MessageBody() room: number, @ConnectedSocket() user: Socket) {
    const game = this.getGameByRoom(room);
    if (!game) {
      return;
    }
    if (!this.isPlayer(game, user) || game.player1.socketId !== user.id) {
      return;
    }
    if (game.update()) {
      this.io.to(game.room.toString()).emit('update-score', game.score);
    }
    if (game.checkWinner()) {
      this.io.to(game.room.toString()).emit('end-game', game);
    } else {
      this.io.to(game.room.toString()).emit('update-ball', game.ball);
    }
  }

  /**
   * Get the list of current games and emit an event sending it.
   * @param user The user socket
   */
  @SubscribeMessage('get-game-list')
  async getGameList(@ConnectedSocket() user: Socket) {
    this.logger.debug(`User with id: ${user.id} get game list!`);

    this.sendGameList();
  }

  /**
   * This function will put the user on the room of the chosen game, this will he will receive all information about the game.
   * @param room Room of the game.
   * @param user The user socket.
   */
  @SubscribeMessage('watch-game')
  async watchGame(
    @MessageBody() room: number,
    @ConnectedSocket() user: Socket
  ) {
    const game = this.getGameByRoom(room);
    if (!game) {
      return;
    }
    if (!game.hasStarted || game.hasEnded) {
      throw new WsBadRequestException('Game not available!');
    }
    user.join(game.room.toString());
    this.sendUpdatesEmits(game);
    this.io.to(game.room.toString()).emit('update-game', game.getGameDto());
    this.logger.log(`User watching game of id:${game.room}`);
  }

  @SubscribeMessage('left-game')
  async leftGame(@ConnectedSocket() user: Socket) {
    this.finishGame(user);
  }

  /**
   * Send emits with the necessary information about the game.
   * @param game Game instance
   */
  sendUpdatesEmits(game: Game) {
    this.io
      .to(game.room.toString())
      .emit('update-player', game.player1, game.player2);
    this.io
      .to(game.room.toString())
      .emit('update-ball', game.ball);
    this.io
      .to(game.room.toString())
      .emit('update-score', game.score);
  }

  /**
   * Check if the user is a player of the selected game.
   * @param game Instance of the game
   * @param user The user socket
   * @returns If the user is a player return true, otherwise false.
   */
  isPlayer(game: Game, user: Socket): boolean {
    if (
      game.player1.socketId === user.id ||
      game.player2.socketId === user.id
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Emit an event with the list of all current live game.
   */
  sendGameList() {
    this.io.emit(
      'get-game-list',
      this.queue.map((game) => {
        if (game.hasStarted && !game.hasEnded) {
          return game.getGameDto();
        }
        return;
      })
    );
  }

  /**
  * This function will check which instance of the game on queue this player is in.
  * After that this instance will be removed.
  * This way the game will be finished.
  *
  * @param id Socket id of the disconnected player
  */
  finishGame(user: Socket) {
    this.sendGameList();
    for (let i = 0; i < this.queue.length; i++) {
      if (
        this.queue[i].player1.socketId === user.id ||
        this.queue[i].player2.socketId === user.id
      ) {
        //delete who left
        if (this.queue[i].player1.socketId === user.id) {
          this.queue[i].player1.quit = true;
        } else if (this.queue[i].player2.socketId === user.id) {
          this.queue[i].player2.quit = true;
        }
        // announce the winner who left before the end-game will be the loser.
        this.queue[i].checkWinner();
        user.leave(this.queue[i].room.toString());
        this.io
          .to(this.queue[i].room.toString())
          .emit('end-game', this.queue[i]);
        delete this.queue[i];
        this.queue.splice(i, 1);
        break;
      }
    }
  }

  /**
   * This function get the game instance with the same room.
   * @param room Room of the selected game.
   * @returns The instance of the game or undefined if not exist.
   */
  getGameByRoom(room: number): Game | undefined {
    for (let i = 0; this.queue[i]; i++) {
      if (this.queue[i].room === room) {
        return this.queue[i];
      }
    }
    return undefined;
  }

  /**
   * this function check if the room get is available.
   * 
   * @param room room of the game
   * @returns available room
   */
  checkGameRoom(room: number) {
    let game;
    for (let index = 0; index < this.queue.length; index++) {
      game = this.queue[index];
      if (game && game.room === room) {
        room = room + 1;
        index = 0;
      }
    }
    return (room);
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
        if (
          (this.queue[i].player1.socketId === '' ||
            this.queue[i].player2.socketId === '') &&
          !this.queue[i].hasEnded
        )
          return i;
      }
    }
    this.queue.push(
      new Game(
        this.checkGameRoom(randomInt(100)),
        this.queue.length - 1 > 0 ? this.queue.length - 1 : this.queue.length
      )
    );
    return this.queue.length - 1;
  }

}
