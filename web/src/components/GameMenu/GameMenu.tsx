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
      <button
        className='gameMenu__button'
        onClick={handleStartGame}
      >
        Join Online Game
      </button>
    </div>
  );
}