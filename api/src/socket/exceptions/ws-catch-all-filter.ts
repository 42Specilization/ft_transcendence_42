import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { SocketWithAuth } from '../types/SocketWithAuth.types';
import { WsBadRequestException, WsTypeException, WsUnknownException } from './ws-exceptions';

/**
 * WsCatchAllFilter class to filter exceptions on socket.
 * If the socket will emit some exception and this class will filter what kind of exception is.
 * The send exception will be change by a more specific Web Socket exception.
 */
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