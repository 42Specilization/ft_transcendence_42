import './Button.scss';
import './ButtonJoinGroup.scss';
import { SignIn } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Modal } from '../Modal/Modal';

interface ButtonJoinGroupProps {
  id: string;
  type: string;
}

export function ButtonJoinGroup({ id, type }: ButtonJoinGroupProps) {

  const { api, config, intraData } = useContext(GlobalContext);
  const [securityJoinVisible, setSecurityJoinVisible] = useState(false);
  const [placeHolder, setPlaceHolder] = useState('');
  const [password, setPassword] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleJoinGroup();
  }

  function selectJoinGroup() {
    if (type === 'protected') {
      setSecurityJoinVisible(true);
    } else {
      handleJoinGroup();
    }
  }

  async function handleJoinGroup() {
    if (type === 'protected' && password.trim()) {
      try {
        await api.patch('/chat/confirmPassword', { groupId: id, password: password }, config);
      } catch (err: any) {
        setPassword('');
        setPlaceHolder(err.response.data.message);
      }
    }
    actionsChat.joinGroup(id, intraData.email);
  }

  return (
    <>
      <button className='button__icon'
        onClick={selectJoinGroup}
      //data-html={true}
      //data-tooltip-content={'Join Group'}
      >
        <SignIn size={32} />
      </button>
      {securityJoinVisible &&
        <Modal id='button__join__group'
          onClose={() => setSecurityJoinVisible(false)}
        >
          <form className='button__join__group__form' onSubmit={handleKeyEnter}>
            <h3>Insert a password</h3>
            <input
              className='button__join__group__input'
              type='password'
              value={password}
              placeholder={placeHolder}
              style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
              onChange={(e) => {
                setPassword(e.target.value);
                setPlaceHolder('');
              }}
              ref={e => e?.focus()}
            />
            <button className='button__join__group__send' type='submit'>
              Join
            </button>
          </form>
        </Modal>
      }
    </>
  );
}
