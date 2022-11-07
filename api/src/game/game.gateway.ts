/* eslint-disable quotes */
/* eslint-disable indent */
import { Logger, UseFilters } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { randomInt } from "crypto";
import { Socket, Namespace } from "socket.io";
import { WsCatchAllFilter } from "src/socket/exceptions/ws-catch-all-filter";
import { WsBadRequestException } from "src/socket/exceptions/ws-exceptions";
import { Game } from "./game.class";

interface IMove {
  direction: string;
  room: number;
}

/**
 * Web Socket configuration of the game pong.
 * The game socket has filters exceptions and authentication with jwt.
 */
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: "game" })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer() io: Namespace;

  queue: Game[] = [];

  /**
   * Function called when the socket start
   */
  afterInit(): void {
    this.logger.log("Game Websocket Gateway initialized.");
  }

  getGameByRoom(room: number): Game | undefined {
    for (let i = 0; this.queue[i]; i++) {
      if (this.queue[i].room === room) {
        return this.queue[i];
      }
    }

    return undefined;
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
          (this.queue[i].player1.socketId === "" ||
            this.queue[i].player2.socketId === "") &&
          !this.queue[i].hasEnded
        )
          return i;
      }
    }
    this.queue.push(
      new Game(
        randomInt(100),
        this.queue.length - 1 > 0 ? this.queue.length - 1 : this.queue.length
      )
    );
    return this.queue.length - 1;
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
          .emit("end-game", this.queue[i]);
        this.io.to(this.queue[i].room.toString()).emit("specs", this.queue[i]);
        delete this.queue[i];
        this.queue.splice(i, 1);
        break;
      }
    }
  }

  @SubscribeMessage("left-game")
  async leftGame(@ConnectedSocket() user: Socket) {
    this.finishGame(user);
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
   * The user will enter a room with the gameId.
   * @param user Socket of the user player.
   */
  @SubscribeMessage("join-game")
  async joinGame(@ConnectedSocket() user: Socket, @MessageBody() name: string) {
    const index = this.checkGameArray();
    if (this.queue[index].player1.socketId === "") {
      this.queue[index].player1.socketId = user.id;
      this.queue[index].player1.name = name;
      user.join(this.queue[index].room.toString());
      this.io
        .to(this.queue[index].room.toString())
        .emit("update-game", this.queue[index]);
      this.logger.debug(
        `Player one connected socket id: ${user.id} Game index:${index} Game id:${this.queue[index].room}`
      );
    } else if (this.queue[index].player2.socketId === "") {
      this.queue[index].player2.socketId = user.id;
      this.queue[index].player2.name = name;
      user.join(this.queue[index].room.toString());
      this.logger.debug(
        `Player two connected socket id: ${user.id} Game index:${index} Game id:${this.queue[index].room}`
      );
      this.queue[index].hasStarted = true;
      this.queue[index].waiting = false;
      this.io
        .to(this.queue[index].room.toString())
        .emit("start-game", this.queue[index]);
      this.sendGameList();
    }
  }

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
   * This function will be called always when a move emit is received.
   * This will check which player and instance game is and move the player.
   * After the movement an update-game event will be send with the instance of the game.
   * @param move Move object with the direction and game index of the player.
   * @param client The player socket
   */
  @SubscribeMessage("move")
  async move(@MessageBody() move: IMove, @ConnectedSocket() user: Socket) {
    const direction = move.direction;

    const game = this.getGameByRoom(move.room);
    if (!game) {
      return;
    }
    if (!this.isPlayer(game, user)) {
      return;
    }
    let position = game.player1.paddle;
    if (user.id === game.player2.socketId) {
      position = game.player2.paddle;
    }

    if (game.isPaddleCollision(position, direction)) {
      return;
    }

    switch (direction) {
      case "up":
        position.y -= 5;
        this.io.to(game.room.toString()).emit("update-game", game);
        break;
      case "down":
        position.y += 5;
        this.io.to(game.room.toString()).emit("update-game", game);
        break;
    }
  }

  @SubscribeMessage("update-ball")
  async update(@MessageBody() room: number, @ConnectedSocket() user: Socket) {
    const game = this.getGameByRoom(room);
    if (!game) {
      return;
    }
    if (!this.isPlayer(game, user)) {
      return;
    }
    game.update();
    if (game.checkWinner()) {
      this.io.to(game.room.toString()).emit("end-game", game);
      this.io.to(game.room.toString()).emit("specs", game);
    } else {
      this.io.to(game.room.toString()).emit("update-ball", game);
      this.io.to(game.room.toString()).emit("specs", game);
    }
  }

  sendGameList() {
    this.io.emit(
      "get-game-list",
      this.queue.map((game) => {
        if (game.hasStarted && !game.hasEnded) {
          return game;
        }
        return;
      })
    );
  }

  @SubscribeMessage("get-game-list")
  async getGameList(@ConnectedSocket() user: Socket) {
    this.logger.debug(`User with id: ${user.id} get game list!`);

    this.sendGameList();
  }

  @SubscribeMessage("watch-game")
  async watchGame(
    @MessageBody() room: number,
    @ConnectedSocket() user: Socket
  ) {
    const game = this.getGameByRoom(room);
    if (!game) {
      return;
    }
    if (!game.hasStarted || game.hasEnded) {
      throw new WsBadRequestException("Game not available!");
    }
    user.join(game.room.toString());
    this.io.to(game.room.toString()).emit("specs", game);
    this.logger.log(`User watching game of id:${game.room}`);
  }
}
