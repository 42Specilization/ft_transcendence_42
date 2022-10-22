import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from './types/SocketWithAuth.types';


export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);

  }

  override createIOServer(port: number, options?: ServerOptions) {
    const clientPort = this.configService.get('CLIENT_PORT');
    const host = this.configService.get('HOST');

    const cors = {
      origin: [
        `http://${host}:${clientPort}`,
        // eslint-disable-next-line no-useless-escape
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ]
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', { cors });

    const optionsWithCORS: ServerOptions | unknown = {
      ...options,
      cors
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.of('game').use(createTokenMiddleware(jwtService, this.logger));
    return (server);
  }
}


const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
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
