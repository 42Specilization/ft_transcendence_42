import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from './dto/createGame.dto';
import { GameService } from './game.service';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post()
  @ApiBody({ type: CreateGameDto })
  @HttpCode(HttpStatus.CREATED)
  createGame(@Body() createGameDto: CreateGameDto): { msg: string } {
    this.gameService.createGame(createGameDto);
    return ({
      msg: 'success'
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getGames() {
    return (await this.gameService.getGames());
  }

}/* It's a constant that is used to get the user data from intra. */
