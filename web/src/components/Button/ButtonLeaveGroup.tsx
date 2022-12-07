import './Button.scss';
import { SignOut } from 'phosphor-react';
import { useContext, useState } from 'react';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';

interface ButtonLeaveGroupProps {
  id: string;
  onLeave: any;
}

export function ButtonLeaveGroup({ id, onLeave}: ButtonLeaveGroupProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  function handleLeaveGroup() {
    actionsChat.leaveGroup(id, intraData.email);
    onLeave();
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tooltip-content={'Leave Group'}
      >
        <SignOut size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Leave group?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleLeaveGroup}
        />
      }
    </>
  );
}