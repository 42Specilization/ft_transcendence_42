import { useState } from 'react';
import { actions } from '../../game/gameState';
import { Commands } from '../Commands/Commands';
import { WatchGame } from '../WatchGame/WatchGame';
import { WithFriend } from '../WithFriend/WithFriend';
import './GameMenu.scss';



export function GameMenu() {

  const [commands, setCommands] = useState<boolean>(true);
  const [watch, setWatch] = useState<boolean>(false);


  const handleStartGame = () => {
    actions.initializeGame();
  };

  const handleCommands = () => {
    setCommands(true);
    setWatch(false);
  };

  const handleWithFriend = () => {
    setCommands(false);
    setWatch(false);
  };

  const handleWatchGame = () => {
    setCommands(false);
    setWatch(true);
  };


  return (
    <div className='gameMenu'>
      <div className='gameMenu__buttons'>
        <button
          className='gameMenu__buttons__button'
          onClick={handleStartGame}
        >
          Play online game
        </button>
        <button
          className='gameMenu__buttons__button'
          onClick={handleWithFriend}
        >
          Play with a friend
        </button>
        <button
          className='gameMenu__buttons__button'
          onClick={handleWatchGame}
        >
          Watch a game
        </button>
        <button
          className='gameMenu__buttons__button'
          onClick={handleCommands}
        >
          Commands
        </button>
      </div>
      <div className='gameMenu__options'>
        {commands === true ? <Commands /> : (watch === true ? <WatchGame /> : <WithFriend />)}
      </div>
    </div>
  );
}