import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGame.dto';
import { GameEntity } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>) {

  }

  async createGame(createGameDto: CreateGameDto) {
    const { player1Name, player1Score, player2Name, player2Score, winner, reasonEndGame } = createGameDto;

    const game = new GameEntity();

    game.player1Name = player1Name;
    game.player1Score = player1Score;
    game.player2Name = player2Name;
    game.player2Score = player2Score;
    game.winner = winner;
    game.reasonEndGame = reasonEndGame;

    try {
      await this.gameRepository.save(game);
    } catch {
      throw new InternalServerErrorException('createGame: Error to save game on db!');
    }

  }

  async getGames() {
    return (await this.gameRepository.find());
  }
}