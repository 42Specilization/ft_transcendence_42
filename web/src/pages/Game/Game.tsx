import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/Game/GameMenu/GameMenu';
import { PongGame } from '../../components/Game/PonGame/PongGame';
import { WaitingRoom } from '../../components/Game/WaitingRoom/WaitingRoom';
import { actions, state } from '../../adapters/game/gameState';
import './Game.scss';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ErrorGameModal } from '../../components/Game/ErrorGameModal/ErrorGameModal';
import { Modal } from '../../components/Modal/Modal';

export default function Game() {

  const { intraData } = useContext(IntraDataContext);
  const currentState = useSnapshot(state);

  const [gameNotFound, setGameNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (currentState.name !== intraData.login) {
      actions.updateName(intraData.login);
    }
  }, [intraData]);

  useEffect(() => {
    currentState.socket?.on('game-not-found', () => {
      setGameNotFound(true);
    });
  }, []);

  return (
    <div className='game'>
      {(() => {
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
      {gameNotFound &&
        <Modal onClose={() => window.location.reload()} id='game__modal'>
          Game Not Found!
        </Modal>
      }
    </div>
  );
}