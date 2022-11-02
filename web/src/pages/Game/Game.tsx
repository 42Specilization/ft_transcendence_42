import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/GameMenu/GameMenu';
import { PongGame } from '../../components/PonGame/PongGame';
import { WaitingRoom } from '../../components/WaitingRoom/WaitingRoom';
import { actions, state } from '../../game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);

  useEffect(() => {
    actions.initializeSocket();
  }, []);

  return (
    <div className='game'>
      {
        currentState.game?.waiting ? <WaitingRoom /> : <GameMenu /> && currentState.game?.hasStarted ? <PongGame /> : <GameMenu />
      }
    </div>
  );
}