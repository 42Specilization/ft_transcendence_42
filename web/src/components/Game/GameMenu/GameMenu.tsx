import { useState } from 'react';
import { actions, state } from '../../../adapters/game/gameState';
import { Checkbox } from '../Checkbox/Checkbox';
import { Commands } from '../Commands/Commands';
import { WatchGame } from '../WatchGame/WatchGame';
import { WithFriend } from '../WithFriend/WithFriend';
import './GameMenu.scss';

export function GameMenu() {

  const [commands, setCommands] = useState<boolean>(true);
  const [watch, setWatch] = useState<boolean>(false);
  const [powerUp, setPowerUp] = useState<boolean>(false);

  const handleStartGame = () => {
    actions.initializeSocket();
    actions.initializeGame(powerUp);
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
    actions.initializeSocket();
    setCommands(false);
    setWatch(true);
  };

  const handleQuit = () => {
    window.location.href = '/';
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
        <button
          className='gameMenu__buttons__button'
          onClick={handleQuit}
        >
          Quit
        </button>
        <div className='gameMenu__buttons__checkbox'>
          <label htmlFor='powerUp'>
            <Checkbox id='powerUp' onCheckedChange={() => setPowerUp(!powerUp)} />
            <span>Enable power up</span>
          </label>
        </div>
      </div>
      <div className='gameMenu__options'>
        {commands === true ? <Commands /> : (watch === true ? <WatchGame /> : <WithFriend />)}
      </div>
    </div>
  );
}