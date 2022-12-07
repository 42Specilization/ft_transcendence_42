import { useSnapshot } from 'valtio';
import { GameMenu } from '../../components/Game/GameMenu/GameMenu';
import { PongGame } from '../../components/Game/PonGame/PongGame';
import { WaitingRoom } from '../../components/Game/WaitingRoom/WaitingRoom';
import { actionsGame, stateGame } from '../../adapters/game/gameState';
import './Game.scss';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ErrorGameModal } from '../../components/Game/ErrorGameModal/ErrorGameModal';
import { Modal } from '../../components/Modal/Modal';

export default function Game() {

  const { intraData } = useContext(GlobalContext);
  const currentState = useSnapshot(stateGame);

  const [gameNotFound, setGameNotFound] = useState<boolean>(false);
  const [gameModalMessage, setGameModalMessage] = useState<string>('Game Not Found!');

  useEffect(() => {
    if (currentState.name !== intraData.login) {
      actionsGame.updateName(intraData.login);
    }
  }, [intraData]);

  useEffect(() => {
    currentState.socket?.on('game-not-found', async (msg) => {
      setGameNotFound(true);
      if (msg) {
        setGameModalMessage(msg);
      }
      await actionsGame.cancelChallengeNotify();
      actionsGame.disconnectSocket();
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
          {gameModalMessage}
        </Modal>
      }
    </div>
  );
}