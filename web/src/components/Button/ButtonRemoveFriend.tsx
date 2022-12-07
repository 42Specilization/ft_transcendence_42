import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { actionsStatus } from '../../adapters/status/statusState';
import { useContext, useState } from 'react';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
      <button
        id='removeFriend_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tooltip-content={'Remove Friend'}
      >
        <UserMinus size={32} />
        <Tooltip anchorId='removeFriend_button' delayShow={50} />
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
