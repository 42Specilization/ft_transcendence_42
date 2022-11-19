import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
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
    game.winner = await this.userService.findUserByNick(winner) as User;
    game.loser = await this.userService.findUserByNick(loser) as User;
    game.reasonEndGame = reasonEndGame;

    try {
      await this.gameRepository.save(game);
    } catch (err) {
      throw new InternalServerErrorException('createGame: Error to save game on db!');
    }

    await this.userService.saveNewGame(winner, game);
    await this.userService.saveNewGame(loser, game);

  }

  async getGames() {
    return (await this.gameRepository.find({ relations: { loser: true, winner: true } }));
  }
}