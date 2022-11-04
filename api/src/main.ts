import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket/socket-io-adapter';


async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  // const host = configService.get('HOST');
  // const clientPort = configService.get('CLIENT_PORT');
  app.enableCors();
  // app.enableCors({
  //   origin: [
  //     `http://${host}:${clientPort}`,
  //     // eslint-disable-next-line no-useless-escape
  //     new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`)
  //   ]
  // });

  const config = new DocumentBuilder()
    .setTitle('Transcendence Api')
    .setDescription('num sei')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
