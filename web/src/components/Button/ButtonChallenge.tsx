import './Button.scss';
import { Sword } from 'phosphor-react';

interface ButtonChallengeProps {
  login: string;
}

export function ButtonChallenge({ login }: ButtonChallengeProps) {

  function handleChallenge() {
    console.log('chamou', login, 'pra um desafio');
  }

  return (
    <button className='button__icon'
      onClick={handleChallenge}
      data-html={true}
      data-tip={'Send Message'}
    >
      <Sword size={32} />
    </button>
  );
}