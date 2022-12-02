import './Button.scss';
import { Alien } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonRemoveAdminProps {
  id: string;
  name: string;
}

export function ButtonRemoveAdmin({ id, name }: ButtonRemoveAdminProps) {

  const { api, config } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleRemoveAdmin() {
    try {
      await api.patch('/chat/removeAdmin', { name: name, groupId: id }, config);
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
        data-tip={'Remove Admin'}
      >
        <Alien size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Remove admin ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleRemoveAdmin}
        />
      }
    </>
  );
}
