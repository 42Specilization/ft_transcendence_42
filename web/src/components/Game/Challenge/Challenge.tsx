import './Challenge.scss';
import { useSnapshot } from 'valtio';
import { useEffect, useState } from 'react';
import { actions, Game, state } from '../../../adapters/game/gameState';
import { Checkbox } from '../../Checkbox/Checkbox';
import { TextInput } from '../../TextInput/TextInput';
import { User } from 'phosphor-react';

export function Challenge() {

  const [powerUp, setPowerUp] = useState<boolean>(false);
  const currentState = useSnapshot(state);

  return (
    <div className='gameMenu__challenge'>
      <h2>Challenge</h2>
      <form className='gameMenu__challenge__form'>
        <TextInput.Root>
          <TextInput.Icon>
            <User size={32} />
          </TextInput.Icon>
          <TextInput.Input type='text' id='friendNick' placeholder='Nick' />
        </TextInput.Root>
        <div className='gameMenu__challenge__form__buttons__checkbox'>
          <label htmlFor='powerUpChallenge'>
            <Checkbox id='powerUpChallenge' onCheckedChange={() => setPowerUp(!powerUp)} />
            <span>Enable power up</span>
          </label>
        </div>
        <button className='gameMenu__challenge__form__button__play'>
          Play
        </button>
      </form>
    </div>
  );
}
