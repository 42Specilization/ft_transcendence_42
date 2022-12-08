import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';
import ReactTooltip from 'react-tooltip';

interface ButtonBlockUserProps {
  login: string;
  handle: ((...args: any[]) => void) | null
  params: any[];
}

export function ButtonBlockUser({ login, handle, params }: ButtonBlockUserProps) {
  const { api, config } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleBlockFriend() {
    await api.patch('/user/addBlocked', { nick: login }, config);
    await api.patch('/chat/deleteDirect', { friend_login: login }, config);
    actionsStatus.updateSelectedUserProfile(login);
    actionsStatus.newBlocked(login);
    if (handle)
      handle(...params);
  }

  return (
    <>
      <button
        id='blockUser_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tip={'Block User'}
      >
        <Prohibit size={32} />
        <ReactTooltip delayShow={50} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Block user?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleBlockFriend}
        />
      }
    </>
  );
}