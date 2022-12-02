import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonUnBanMemberProps {
  id: string;
  name: string;
}

export function ButtonUnBanMember({ id, name }: ButtonUnBanMemberProps) {

  const { intraData } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnBanMember() {
    try {
      actionsChat.removeBanMember(id, intraData.email, name);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tip={'UnBan Member'}
      >
        <Prohibit size={32} />
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
