import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import ReactTooltip from 'react-tooltip';


interface ButtonBanMemberProps {
  id: string;
  name: string;
}

export function ButtonBanMember({ id, name }: ButtonBanMemberProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleBanMember() {
    actionsChat.banMember(id, intraData.email, name);
  }

  return (
    <>
      <button
        id='banMember_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tip={'Ban Member'}
      >
        <Prohibit size={32} />
        <ReactTooltip delayShow={50} />
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
