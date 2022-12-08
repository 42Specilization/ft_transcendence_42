import './Button.scss';
import { SpeakerHigh } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import ReactTooltip from 'react-tooltip';


interface ButtonUnMuteMemberProps {
  id: string;
  name: string;
}

export function ButtonUnMuteMember({ id, name }: ButtonUnMuteMemberProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnmute() {
    actionsChat.unmuteMember(id, intraData.email, name);
  }

  return (
    <>
      <button
        id='unMuteMember_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tip={'Unmute Member'}
      >
        <SpeakerHigh size={32} />
        <ReactTooltip delayShow={50} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Unmute ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleUnmute}
        />
      }
    </>
  );
}
