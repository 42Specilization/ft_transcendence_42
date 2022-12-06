import './Challenge.scss';
import { useSnapshot } from 'valtio';
import { useContext, useEffect, useState } from 'react';
import { actions, state } from '../../../adapters/game/gameState';
import { Checkbox } from '../../Checkbox/Checkbox';
import { Link } from 'react-router-dom';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { Modal } from '../../Modal/Modal';

interface ChallengeProps {
  nick: string;
  path: string;
}

export function Challenge({ nick, path }: ChallengeProps) {

  const [powerUp, setPowerUp] = useState<boolean>(false);
  const [modalErrorChallenge, setModalErrorChallenge] = useState<boolean>(false);
  const { intraData, api, config } = useContext(IntraDataContext);
  const currentState = useSnapshot(state);

  useEffect(() => {
    if (currentState.name !== intraData.login) {
      actions.updateName(intraData.login);
    }
  }, [intraData]);

  function handleChallengeGame() {
    const socket = actions.initializeSocket();
    actions.challengeFriend(nick, powerUp);
    socket?.on('game-room', async (room) => {
      try {
        const challenge = {
          room: room,
          userSource: intraData.login,
          userTarget: nick
        };
        await api.patch('/user/sendChallengeRequest', challenge, config);
        actionsStatus.newNotify(nick);
      } catch (err: unknown) {
        setModalErrorChallenge(true);
      }
    });
  }

  return (
    <div className='challenge'>
      <h2>Challenge</h2>
      <form className='challenge__form'>
        <div className='challenge__form__buttons__checkbox'>
          <label htmlFor='powerUpChallenge'>
            <Checkbox id='powerUpChallenge' onCheckedChange={() => setPowerUp(!powerUp)} />
            <span>Enable power up</span>
          </label>
        </div>
        <Link to={path}>
          <button className='challenge__form__button__play' onClick={handleChallengeGame}>
            Play
          </button>
        </Link>
      </form>
      {modalErrorChallenge &&
        <Modal onClose={() => setModalErrorChallenge(true)} id='challenge__modal'>
          Error to challenge a player!
        </Modal>

      }
    </div>
  );
}
