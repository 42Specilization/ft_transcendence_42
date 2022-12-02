import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonBanMemberProps {
  id: string;
  name: string;
}

export function ButtonBanMember({ id, name }: ButtonBanMemberProps) {

  const { intraData } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleBanMember() {
    actionsChat.banMember(id, intraData.email, name);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tip={'Ban Member'}
      >
        <Prohibit size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Ban ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleBanMember}
        />
      }
    </>
  );
}
