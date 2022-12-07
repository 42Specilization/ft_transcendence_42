import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonKickMemberProps {
  id: string;
  name: string;
}

export function ButtonKickMember({ id, name }: ButtonKickMemberProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleKickMember() {
    actionsChat.kickMember(id, intraData.email, name);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tooltip-content={'Kick Member'}
      >
        <UserMinus size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Kick ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleKickMember}
        />
      }
    </>
  );
}
