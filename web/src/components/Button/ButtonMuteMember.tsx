import './Button.scss';
import { SpeakerSlash } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonMuteMemberProps {
  id: string;
  name: string;
}

export function ButtonMuteMember({ id, name }: ButtonMuteMemberProps) {

  const { api, config } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleMuteMember() {
    try {
      await api.patch('/chat/muteMember', { name: name, groupId: id }, config);
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
        data-tip={'Mute Member(15 minutes)'}
      >
        <SpeakerSlash size={32} />
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
