import './Button.scss';
import { Sword } from 'phosphor-react';
import { Modal } from '../Modal/Modal';
import { Challenge } from '../Game/Challenge/Challenge';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';

interface ButtonChallengeProps {
  login: string;
}

export function ButtonChallenge({ login }: ButtonChallengeProps) {
  const [challengeModal, setChallengeModal] = useState(false);
  const [challengeYourSelfModal, setChallengeYourSelfModal] = useState(false);
  const { intraData } = useContext(IntraDataContext);

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
        <button className='button__icon'
          onClick={handleChallenge}
          data-html={true}
          data-tip={'Challenge Player'}
        >
          <Sword size={32} />
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