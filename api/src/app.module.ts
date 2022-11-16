/* eslint-disable quotes */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { GameEntity } from './game/entities/game.entity';
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { GameModule } from "./game/game.module";
// import { ChatModule } from "./chat/chat.module";
import { Notify } from "./notification/entities/notify.entity";
import { StatusModule } from "./status/status.module";
import { Relations } from "./relations/entity/relations.entity";
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
      entities: [User, Notify, Relations, GameEntity],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    ConfigModule.forRoot(),
    UserModule,
    GameModule,
    // ChatModule,
    StatusModule,
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
export class AppModule { }
