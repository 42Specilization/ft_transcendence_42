import './Button.scss';
import { SpeakerHigh } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonUnMuteMemberProps {
  id: string;
  name: string;
}

export function ButtonUnMuteMember({ id, name }: ButtonUnMuteMemberProps) {

  const { api, config } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleUnmute() {
    try {
      await api.patch('/chat/removeMuteMember', { name: name, groupId: id }, config);
      actionsChat.getUpdateGroup(id);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tip={'Unmute Member'}
      >
        <SpeakerHigh size={32} />
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
