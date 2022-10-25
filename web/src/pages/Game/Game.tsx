import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/GameMenu/GameMenu';
import { PongGame } from '../../components/PonGame/PongGame';
import { actions, state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);

  useEffect(() => {
    console.log(currentState.game);
  }, [currentState]);


  return (
    <div className='game'>
      {/* <PongGame /> */}
      {
        currentState.game?.hasStarted ? <PongGame /> : <GameMenu />
      }
    </div>
  );
}