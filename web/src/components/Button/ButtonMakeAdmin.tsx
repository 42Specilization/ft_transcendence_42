import './Button.scss';
import { Alien } from 'phosphor-react';
import { useContext, useState } from 'react';
import { actionsChat } from '../../adapters/chat/chatState';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';

interface ButtonMakeAdminProps {
  id: string;
  name: string;
}

export function ButtonMakeAdmin({ id, name }: ButtonMakeAdminProps) {

  const { api, config } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleMakeAdmin() {
    try {
      await api.patch('/chat/addAdmin', { name: name, groupId: id }, config);
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
        data-tip={'Make Admin'}
      >
        <Alien size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={`Make admin ${name}?`}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleMakeAdmin}
        />
      }
    </>
  );
}
