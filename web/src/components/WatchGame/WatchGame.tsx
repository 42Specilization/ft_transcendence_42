import './WatchGame.scss';
import { useSnapshot } from 'valtio';
import { useEffect, useState } from 'react';
import { actions, Game, state } from '../../game/gameState';

interface LiveGamesProps {
  game: Game;
}

function LiveGame({ game }: LiveGamesProps) {

  const currentState = useSnapshot(state);

  const handleWatchLiveGame = () => {
    console.log('op clicou aq ', currentState.socket);
    actions.updateGame(game);
    currentState.socket?.emit('watch-game', game.index);
  };

  return (
    <li onClick={handleWatchLiveGame}>
      {game.player1.name} vs {game.player2.name}
    </li>
  );
}

export function WatchGame() {

  const currentState = useSnapshot(state);
  const [gameList, setGameList] = useState<Game[]>();


  useEffect(() => {
    console.log('opa no watch game!');
    currentState.socket?.emit('get-game-list');
    currentState.socket?.on('get-game-list', (games: Game[]) => {
      setGameList(games);
    });
  }, []);

  return (
    <div className='gameMenu__watchGame'>
      <h2>Live Games</h2>
      <ul className='gameMenu__watchGame__list'>
        {gameList?.map(game => {
          return (
            <LiveGame game={game} key={game.id} />
          );
        })}
      </ul>
    </div>
  );
}