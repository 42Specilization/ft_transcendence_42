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
import { MsgToClient, MsgToServer } from "./chat.class";
import { ChatService } from "./chat.service";

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: "chat" })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server: Namespace;

  constructor(private readonly chatService: ChatService) { }


  private logger: Logger = new Logger(ChatGateway.name);

  afterInit() {
    this.logger.log("Chat Websocket Gateway initialized.");
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

  @SubscribeMessage("createChat")
  async createChat(client: Socket,
    { type, usersLogin }: {type: string, usersLogin: string[]}) {

    const chat: string = await this.chatService.createChat(type, usersLogin);

    this.server.to(client.id).emit('newChatCreated', chat);
    this.logger.debug(`Client ${client.id} create chat : |${chat}|`);
  }

  @SubscribeMessage("joinChat")
  async handleJoinChat(client: Socket, chat: string) {

    client.join(chat);

    this.logger.debug(`Client ${client.id} join a chat: |${chat}|`);
  }

  @SubscribeMessage("msgToServer")
  async handleMsgToServer(client: Socket, message: MsgToServer) {
    const msgToClient: MsgToClient = await this.chatService.saveMessage(message);

    this.server.to(message.chat).emit('msgToClient', msgToClient);
    this.logger.debug(`Client ${client.id} send message : |${msgToClient}|`);
  }
}
