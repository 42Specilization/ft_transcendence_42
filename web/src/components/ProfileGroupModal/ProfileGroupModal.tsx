import './ProfileGroupModal.scss';
import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { GroupProfile } from '../GroupProfile/GroupProfile';

interface ProfileGroupModalProps {
  id: string | undefined;
  setProfileGroupVisible: Dispatch<SetStateAction<boolean>>;
}

export function ProfileGroupModal({ id, setProfileGroupVisible }: ProfileGroupModalProps) {

  const handleOutsideClick = (e: any) => {
    if (e.target.id === 'profile__group__modal')
      setProfileGroupVisible(false);
  };

  return (
    <div id='profile__group__modal' className='profile__group__modal' onClick={handleOutsideClick}>
      <div className='profile__group__modal__container'>
        <div className='profile__group__modal__container__content'>
          <GroupProfile id={id} setProfileGroupVisible={setProfileGroupVisible} />
        </div>
        <div className='profile__group__modal__container__closeButton__div' >
          <button className='profile__group__modal__container__closeButton'
            onClick={() => setProfileGroupVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}