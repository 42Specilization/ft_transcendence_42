/* eslint-disable quotes*/
import { Logger, UseFilters } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Socket, Namespace } from "socket.io";
import { WsCatchAllFilter } from "src/socket/exceptions/ws-catch-all-filter";
import { ChatMsg } from "./chat.class";

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: "chat" })
export class ChatGateway
implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Namespace;
  private logger: Logger = new Logger(ChatGateway.name);

  afterInit() {
    this.logger.log("Game Websocket Gateway initialized.");
  }

  handleConnection(client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`WS client with id: ${client.id} connected of chatSocket!`);
    this.logger.debug(`Number of connected chatSockets: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.sockets;

    this.logger.log(`Disconnected of chatSocket the socket id: ${client.id}`);
    this.logger.debug(`Number of connected chatSockets: ${sockets.size}`);
  }

  @SubscribeMessage("msgToServer")
  handleMessage(client: Socket, message: ChatMsg) {
    this.server.emit("msgToClient", message, client.id);
    this.logger.debug(`Client ${client.id} send message : |${message.msg}|`);
  }
}
