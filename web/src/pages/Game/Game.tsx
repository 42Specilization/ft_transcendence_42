import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/GameMenu/GameMenu';
import { PongGame } from '../../components/PonGame/PongGame';
import { WaitingRoom } from '../../components/WaitingRoom/WaitingRoom';
import { actions, state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);

  useEffect(() => {
    console.log(currentState.game);
  }, [currentState]);


  return (
    <div className='game'>
      {
        currentState.game?.waiting ? <WaitingRoom /> : <GameMenu /> && currentState.game?.hasStarted ? <PongGame /> : <GameMenu />
      }
    </div>
  );
}