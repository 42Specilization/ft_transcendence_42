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
    const { winner, looser, looserScore, winnerScore, reasonEndGame } = createGameDto;

    const game = new GameEntity();

    game.looserScore = looserScore;
    game.winnerScore = winnerScore;
    game.winner = await this.userService.findUserByNick(winner) as User;
    game.looser = await this.userService.findUserByNick(looser) as User;
    game.reasonEndGame = reasonEndGame;

    try {
      await this.gameRepository.save(game);
    } catch (err) {
      throw new InternalServerErrorException('createGame: Error to save game on db!');
    }

    await this.userService.saveNewGame(winner, game);
    await this.userService.saveNewGame(looser, game);

  }

  async getGames() {
    return (await this.gameRepository.find({ relations: { looser: true, winner: true } }));
  }
}