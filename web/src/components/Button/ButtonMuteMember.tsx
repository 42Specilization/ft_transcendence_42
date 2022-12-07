import './Button.scss';
import { SpeakerSlash } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ButtonMuteMemberProps {
  id: string;
  name: string;
}

export function ButtonMuteMember({ id, name }: ButtonMuteMemberProps) {

  const { intraData } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleMuteMember() {
    actionsChat.muteMember(id, intraData.email, name);
  }

  return (
    <>
      <button
        id='muteMember_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tooltip-content={'Mute Member(15 minutes)'}
      >
        <SpeakerSlash size={32} />
        <Tooltip anchorId='muteMember_button' delayShow={50} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Mute ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleMuteMember}
        />
      }
    </>
  );
}
