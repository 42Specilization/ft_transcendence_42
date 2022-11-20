import './WatchGame.scss';
import { useSnapshot } from 'valtio';
import { useEffect, useState } from 'react';
import { actions, Game, state } from '../../../adapters/game/gameState';

export function WatchGame() {

  const currentState = useSnapshot(state);
  const [gameList, setGameList] = useState<Game[]>([]);

  const handleWatchLiveGame = (game: Game) => {
    if (game.hasEnded) {
      return;
    }
    actions.updateGame(game);
    currentState.socket?.emit('watch-game', game.room);
  };

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
                <li onClick={() => { handleWatchLiveGame(game); }} key={game.room}>
                  {game.player1Name} vs {game.player2Name}
                </li>
              );
            }) : <p>No game Available</p>}
      </ul>
    </div>
  );
}
