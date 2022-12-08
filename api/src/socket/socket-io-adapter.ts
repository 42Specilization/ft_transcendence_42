import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from './types/SocketWithAuth.types';

/**
 * SocketIOAdapter is to configure the socket, like the cors and authentication.
 */
export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);

  }

  /**
   *
   * @param port Port to stand up the socket
   * @param options Configs of the server.
   * @returns
   */
  override createIOServer(port: number, options?: ServerOptions) {
    const clientPort = this.configService.get('CLIENT_PORT');
    const host = this.configService.get('HOST');

    const cors = {
      origin: [
        `http://${host}:${clientPort}`,
        new RegExp(`/^http://192.168.1.([1-9]|[1-9]d):${clientPort}$/`),
      ]
    };

    const optionsWithCORS: ServerOptions | unknown = {
      ...options,
      cors
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, optionsWithCORS);
    //set middleware configuration of nestjs to socket with namespace game
    server.of('status').use(createTokenMiddleware(jwtService, this.logger));
    server.of('chat').use(createTokenMiddleware(jwtService, this.logger));
    server.of('game').use(createTokenMiddleware(jwtService, this.logger));
    return (server);
  }
}

/**
 * function to validate the token received on socket connection.
 *
 * @param jwtService Service JWT to work with.
 * @param logger Logger instance to work with.
 * @returns
 */
const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (socket: SocketWithAuth, next: any) => {
      const token = socket.handshake.auth['token'] || socket.handshake.headers['token'];

      logger.debug(`Validating auth token before connection: ${token}`);

      try {
        const payload = jwtService.verify(token);
        socket.email = payload.email;
        socket.token = payload.token;
        next();
      } catch {
        next(new Error('FORBIDDEN'));
      }

    };
