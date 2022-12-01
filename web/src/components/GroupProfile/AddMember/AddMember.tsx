import './AddMember.scss';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { actionsStatus } from '../../../adapters/status/statusState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Modal } from '../../Modal/Modal';
import { PaperPlaneRight } from 'phosphor-react';

interface AddMemberProps {
  id: string | undefined;
  setModalAddMember: Dispatch<SetStateAction<boolean>>;
}

export function AddMember({ id, setModalAddMember }: AddMemberProps) {

  const { api, config } = useContext(IntraDataContext);
  const [inviteName, setInviteName] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendGroupInvite();
  }

  async function sendGroupInvite() {
    try {
      if (inviteName.trim()) {
        await api.patch('/chat/sendGroupInvite', { name: inviteName, groupId: id }, config);
        actionsStatus.newNotify(inviteName, 'group');
        setInviteName('');
        setModalAddMember(false);
      }
    } catch (err: any) {
      setInviteName('');
      setPlaceHolder(err.response.data.message);
    }
  }

  return (
    <Modal id='group__addMember'
      onClose={() => { setModalAddMember(false); }}
    >
      <form className='group__addMember__modal' onSubmit={handleKeyEnter}>
        <div className='group__addMember__modal__text__div'>
          <h3>Insert a nick</h3>
          <input
            className='group__addMember__modal__input'
            maxLength={15}
            value={inviteName}
            placeholder={placeHolder}
            style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
            onChange={(e) => {
              setInviteName(e.target.value);
              setPlaceHolder('');
            }}
            ref={e => e?.focus()}
          />
        </div>
        <button className='group__addMember__modal__button' type='submit'>
          <PaperPlaneRight size={30} />
        </button>
      </form>
    </Modal>
  );
}

