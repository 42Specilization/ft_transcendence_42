import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';

interface ButtonBlockUserProps {
  login: string;
  handle: ((...args: any[]) => void) | null
  params: any[];
}

export function ButtonBlockUser({ login, handle, params }: ButtonBlockUserProps) {

  const { api, config } = useContext(IntraDataContext);
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
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tooltip-content={'Block User'}
      >
        <Prohibit size={32} />
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