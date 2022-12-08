import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGame.dto';
import { GameEntity } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>,
    private userService: UserService) { }

  async createGame(createGameDto: CreateGameDto) {
    const { winner, loser, loserScore, winnerScore, reasonEndGame } = createGameDto;

    const game = new GameEntity();

    game.loserScore = loserScore;
    game.winnerScore = winnerScore;
    const userWinner = await this.userService.findUserByNick(winner);
    const userLoser = await this.userService.findUserByNick(loser);
    if (!userWinner || !userLoser) {
      return;
    }
    game.winner = userWinner;
    game.loser = userLoser;
    game.reasonEndGame = reasonEndGame;

    try {
      await this.gameRepository.save(game);
    } catch (err) {
      throw new InternalServerErrorException('createGame: Error to save game on db!');
    }

    await this.userService.saveNewGame(winner, game);
    await this.userService.saveNewGame(loser, game);

  }

  async isBlocked(player1: string, player2: string) {
    const user1 = await this.userService.findUserByNick(player1);
    const user2 = await this.userService.findUserByNick(player2);
    if (!user1 || !user2)
      return true;
    return this.userService.isBlocked(user1, user2) || this.userService.isBlocked(user2, user1);
  }

  async isUserOnline(userName: string) {
    const user = await this.userService.findUserByNick(userName);
    if (!user) {
      return (false);
    }
    return (user.status === 'online');

  }

}