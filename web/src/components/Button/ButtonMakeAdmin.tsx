import './Button.scss';
import { Alien } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';
import ReactTooltip from 'react-tooltip';

interface ButtonMakeAdminProps {
  id: string;
  name: string;
}

export function ButtonMakeAdmin({ id, name }: ButtonMakeAdminProps) {
  const { api, config } = useContext(GlobalContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleMakeAdmin() {
    try {
      await api.patch('/chat/addAdmin', { name: name, groupId: id }, config);
      actionsStatus.changeGroupAdmins(id);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button
        id='makeAdmin_button'
        className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-tip={'Make Admin'}
      >
        <Alien size={32} />
        <ReactTooltip delayShow={50} />
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
