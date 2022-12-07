import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ButtonUnBlockedUserProps {
  login: string;
}

export function ButtonUnBlockedUser({ login }: ButtonUnBlockedUserProps) {

  const { api, config } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnblock() {
    await api.patch('/user/removeBlocked', { nick: login }, config);
    actionsStatus.updateSelectedUserProfile(login);
    actionsStatus.removeBlocked(login);
  }

  return (
    <>
      <button
        id='unBlockUser_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tooltip-content={'Unblock'}
      >
        <UserMinus size={32} />
        <Tooltip anchorId='unBlockUser_button' delayShow={50} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Unblock user?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={() => { setConfirmActionVisible(false); handleUnblock(); }}
        />
      }
    </>
  );
}