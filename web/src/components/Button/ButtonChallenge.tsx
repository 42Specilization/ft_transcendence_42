import './Button.scss';
import { Sword } from 'phosphor-react';
import { Modal } from '../Modal/Modal';
import { Challenge } from '../Game/Challenge/Challenge';
import { useState } from 'react';

interface ButtonChallengeProps {
  login: string;
}

export function ButtonChallenge({ login }: ButtonChallengeProps) {
  const [challengeModal, setChallengeModal] = useState(false);
  
  function handleChallenge() {
    setChallengeModal(true);
  }

  return (
    <>
      <button className='button__icon'
        onClick={handleChallenge}
        data-html={true}
        data-tip={'Send Message'}
      >
        <Sword size={32} />
      </button>
      {
        challengeModal &&
      <Modal onClose={() => setChallengeModal(false)} id='card__modal__challenge'>
        <Challenge path='/game' nick={login} />
      </Modal>
      }
    </>
  );
}