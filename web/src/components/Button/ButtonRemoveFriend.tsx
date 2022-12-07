import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { actionsStatus } from '../../adapters/status/statusState';
import { useContext, useState } from 'react';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonRemoveFriendProps {
  login: string;
}

export function ButtonRemoveFriend({ login }: ButtonRemoveFriendProps) {

  const { api, config } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleRemoveFriend() {
    await api.patch('/user/removeFriend', { nick: login }, config);
    actionsStatus.removeFriend(login);
    actionsStatus.updateSelectedUserProfile(login);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
      //data-html={true}
      //data-tooltip-content={'Remove Friend'}
      >
        <UserMinus size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Remove friend?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleRemoveFriend}
        />
      }
    </>
  );
}
