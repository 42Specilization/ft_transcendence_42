import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/Game/GameMenu/GameMenu';
import { PongGame } from '../../components/Game/PonGame/PongGame';
import { WaitingRoom } from '../../components/Game/WaitingRoom/WaitingRoom';
import { actions, state } from '../../adapters/game/gameState';
import './Game.scss';
import { useContext, useEffect } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ErrorGameModal } from '../../components/Game/ErrorGameModal/ErrorGameModal';

export default function Game() {

  const { intraData } = useContext(IntraDataContext);
  const currentState = useSnapshot(state);

  useEffect(() => {
    if (currentState.name !== intraData.login) {
      actions.updateName(intraData.login);
    }
  }, [intraData]);

  return (
    <div className='game'>      {(() => {
      if (currentState.serverError !== undefined && currentState.serverError === true) {
        return (<ErrorGameModal />);
      }
      else if (currentState.game?.waiting)
        return (<WaitingRoom />);
      else if (currentState.game?.hasStarted)
        return (<PongGame />);
      else
        return (<GameMenu />);
    })()}

    </div>
  );
}