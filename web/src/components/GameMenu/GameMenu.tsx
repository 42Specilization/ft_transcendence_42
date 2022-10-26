import { useSnapshot } from 'valtio';
import { actions, state } from '../../game/gameState';
import './GameMenu.scss';

export function GameMenu() {

  const currentState = useSnapshot(state);

  const handleStartGame = () => {
    actions.initializeSocket();
    actions.initializeGame();
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
        >
          Play with a friend
        </button>
        <button
          className='gameMenu__buttons__button'
        >
          Watch a game
        </button>
        <button
          className='gameMenu__buttons__button'
        >
          Quit
        </button>
      </div>
      <div className='gameMenu__commands'>
        <h2>Commands</h2>
        <ul className='gameMenu__commands__list'>
          <li>[W] or [ArrowUp] - move to up.</li>
          <li>[S] or [ArrowDown] - move to down.</li>
          <li>[ESC] - Exit the game.</li>
        </ul>
      </div>
    </div>
  );
}