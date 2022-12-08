import './Button.scss';
import { User } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';
import ReactTooltip from 'react-tooltip';


interface ButtonRemoveAdminProps {
  id: string;
  name: string;
}

export function ButtonRemoveAdmin({ id, name }: ButtonRemoveAdminProps) {

  const { api, config } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleRemoveAdmin() {
    try {
      await api.patch('/chat/removeAdmin', { name: name, groupId: id }, config);
      actionsStatus.changeGroupAdmins(id);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button
        id='removeAdmin_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tip={'Remove Admin'}
      >
        <User size={32} />
        <ReactTooltip delayShow={50} />
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
