/* eslint-disable quotes */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { GameModule } from "./game/game.module";
import { ChatMoule } from "./chat/chat.module";
import { Notification } from "./notification/entities/notification.entity";
import { NotificationModule } from "./notification/notification.module";
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env["DATABASE_HOST"],
      port: 5432,
      username: "pguser",
      password: "pgpassword",
      database: "postgres",
      entities: [User, Notification],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    ConfigModule.forRoot(),
    UserModule,
    GameModule,
    ChatMoule,
    NotificationModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // }
  ],
})
export class AppModule {}
