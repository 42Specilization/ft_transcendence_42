/* eslint-disable indent */
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
    if (game.hasEnded) {
      return;
    }
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
  const [gameList, setGameList] = useState<Game[]>([]);

  function getList() {
    currentState.socket?.emit('get-game-list');
    currentState.socket?.on('get-game-list', (games: Game[]) => {
      setGameList(games);
    });
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className='gameMenu__watchGame'>
      <h2>Live Games</h2>
      <ul className='gameMenu__watchGame__list'>
        {
          gameList?.length > 0 ?
            gameList?.map(game => {
              return (
                <LiveGame game={game} key={game.id} />
              );
            }) : <p>No game Available</p>}
      </ul>
    </div>
  );
}


