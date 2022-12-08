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
  const node = configService.get('NODE');
  const host = configService.get('HOST');
  const clientPort = configService.get('CLIENT_PORT');
  app.enableCors({
    origin: [
      `http://${host}:${clientPort}`,
      new RegExp(`/^http://192.168.1.([1-9]|[1-9]d):${clientPort}$/`)
    ]
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (node !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Transcendence Api')
      .setDescription('Swagger of pong game 42 transcendence!')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
