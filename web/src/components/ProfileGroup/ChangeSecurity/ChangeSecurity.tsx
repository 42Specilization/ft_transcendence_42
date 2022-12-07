import './ChangeSecurity.scss';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Modal } from '../../Modal/Modal';
import { SelectItem } from '../../SelectItem/SelectItem';
import { actionsStatus } from '../../../adapters/status/statusState';

interface ChangeSecurityProps {
  id: string | undefined;
  setModalChangeSecurity: Dispatch<SetStateAction<boolean>>;
}

export function ChangeSecurity({ id, setModalChangeSecurity }: ChangeSecurityProps) {

  const { api, config } = useContext(GlobalContext);
  const [password, setPassword] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');
  const [securityType, setSecurityType] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveChangeSecurity();
  }

  async function saveChangeSecurity() {
    if (securityType.includes('protected')) {
      if (!password.trim()) {
        setPassword('');
        setPlaceHolder('Invalid Password');
        return;
      }
    }
    await api.patch('/chat/updateGroup', { id: id, type: securityType, password: password }, config);
    actionsStatus.changeGroupPrivacy(id as string, securityType);
    setModalChangeSecurity(false);
    setSecurityType('');
    setPassword('');
  }

  return (
    <Modal id='changeSecurity__modal' onClose={() => setModalChangeSecurity(false)}>
      <form className='group__changeSecurity__modal' onSubmit={handleKeyEnter}>
        <SelectItem onValueChange={(e) => setSecurityType(e)} />
        <div className='group__changeSecurity__modal__text__div'>
          {securityType === 'protected' &&
            <>
              <h3>Insert a password</h3>
              <input
                className='group__changeSecurity__modal__input'
                value={password}
                placeholder={placeHolder}
                style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPlaceHolder('');
                }}
                ref={e => e?.focus()}
              />
            </>
          }
        </div>
        <button className='group__changeSecurity__modal__button' type='submit'>
          Save
        </button>
      </form>
    </Modal>
  );
}

