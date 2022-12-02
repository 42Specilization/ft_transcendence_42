import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';

interface ButtonBlockedUserProps {
  login: string;
}

export function ButtonBlockedUser({ login }: ButtonBlockedUserProps) {

  const { api, config, setIntraData } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnblock() {
    await api.patch('/user/removeBlocked', { nick: login }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        blocked: prevIntraData.blocked.filter((key) => key.login != login)
      };
    });
    actionsStatus.removeBlocked(login);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tip={'Unblock'}
      >
        <UserMinus size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Unblock user?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleUnblock}
        />
      }
    </>
  );
}