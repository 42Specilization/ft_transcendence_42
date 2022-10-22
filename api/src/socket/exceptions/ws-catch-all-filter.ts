import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { SocketWithAuth } from '../types/SocketWithAuth.types';
import { WsBadRequestException, WsTypeException, WsUnknownException } from './ws-exceptions';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exceptionData: any = exception.getResponse();

      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? exceptionData ?? exception.name
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }

}