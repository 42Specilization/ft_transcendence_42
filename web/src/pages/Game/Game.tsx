import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/Game/GameMenu/GameMenu';
import { PongGame } from '../../components/Game/PonGame/PongGame';
import { WaitingRoom } from '../../components/Game/WaitingRoom/WaitingRoom';
import { state } from '../../adapters/game/gameState';
import './Game.scss';

export default function Game() {

  const currentState = useSnapshot(state);

  return (
    <div className='game'>
      {(() => {
        if (currentState.game?.waiting)
          return <WaitingRoom />;
        else if (currentState.game?.hasStarted)
          return <PongGame />;
        else
          return <GameMenu />;
      })()}
    </div>
  );
}