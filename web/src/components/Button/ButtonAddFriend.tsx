import './Button.scss';
import { UserPlus } from 'phosphor-react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { actionsStatus } from '../../adapters/status/statusState';
import { useContext, useState } from 'react';
import { Modal } from '../Modal/Modal';
import ReactTooltip from 'react-tooltip';


interface ButtonAddFriendProps {
  login: string;
}

export function ButtonAddFriend({ login }: ButtonAddFriendProps) {

  const { api, config } = useContext(GlobalContext);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [error, setError] = useState('');

  async function handleAddFriend() {
    try {
      await api.patch('/user/sendFriendRequest', { nick: login }, config);
      actionsStatus.newNotify(login);
    } catch (err: any) {
      setError(err.response.data.message);
      setModalErrorVisible(true);
    }
  }

  return (
    <>
      <button
        id='addFriend_button'
        className='button__icon'
        onClick={handleAddFriend}
        data-tip={'Add Friend'}
      >
        <UserPlus size={32} />
        <ReactTooltip delayShow={50} />
      </button>
      {modalErrorVisible &&
        <Modal onClose={() => setModalErrorVisible(false)}>
          <p style={{ fontSize: '2em', textAlign: 'center' }}>{error}</p>
        </Modal>
      }
    </>
  );
}
