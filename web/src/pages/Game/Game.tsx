import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/GameMenu/GameMenu';
import { PongGame } from '../../components/PonGame/PongGame';
import { WaitingRoom } from '../../components/WaitingRoom/WaitingRoom';
import { state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);

  useEffect(() => {
    console.log('game is', currentState.game);
  }, [currentState.game?.hasStarted]);

  return (
    <div className='game'>
      {
        currentState.game?.waiting ? <WaitingRoom /> : (currentState.game?.hasStarted ? <PongGame /> : <GameMenu />)
      }
    </div>
  );
}