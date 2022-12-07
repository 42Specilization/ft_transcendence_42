import './Button.scss';
import { UserMinus } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonUnBanMemberProps {
  id: string;
  name: string;
}

export function ButtonUnBanMember({ id, name }: ButtonUnBanMemberProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnBanMember() {
    actionsChat.removeBanMember(id, intraData.email, name);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
      //data-html={true}
      //data-tooltip-content={'UnBan Member'}
      >
        <UserMinus size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`UnBan ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleUnBanMember}
        />
      }
    </>
  );
}
