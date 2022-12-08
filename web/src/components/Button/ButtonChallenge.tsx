import './Button.scss';
import './ButtonChallenge.scss';
import { Sword } from 'phosphor-react';
import { Modal } from '../Modal/Modal';
import { Challenge } from '../Game/Challenge/Challenge';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import ReactTooltip from 'react-tooltip';

interface ButtonChallengeProps {
  login: string;
}

export function ButtonChallenge({ login }: ButtonChallengeProps) {
  const [challengeModal, setChallengeModal] = useState(false);
  const [challengeYourSelfModal, setChallengeYourSelfModal] = useState(false);
  const { intraData } = useContext(GlobalContext);

  function handleChallenge() {
    if (intraData.login === login) {
      setChallengeYourSelfModal(true);
    } else {
      setChallengeModal(true);
    }
  }

  return (
    <>
      {intraData.login !== login &&
        <button
          id='challenge_button'
          className='button__icon'
          onClick={handleChallenge}
          data-tip={'Challenge Player'}
        >
          <Sword size={32} />
          <ReactTooltip delayShow={50} />
        </button>}
      {
        challengeModal &&
        <Modal onClose={() => setChallengeModal(false)} id='card__modal__challenge'>
          <Challenge path='/game' nick={login} />
        </Modal>
      }
      {
        challengeYourSelfModal &&
        <Modal onClose={() => setChallengeYourSelfModal(false)} id='card__modal__challengeYourSelf'>
          <span>You cant challenge your self!</span>
        </Modal>
      }
    </>
  );
}