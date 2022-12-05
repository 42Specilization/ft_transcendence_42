import './ProfileGroupModal.scss';
import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { ProfileGroup } from '../ProfileGroup';


interface ProfileGroupModalProps {
  id: string | undefined;
  setProfileGroupVisible: Dispatch<SetStateAction<boolean>>;
}

export function ProfileGroupModal({ id, setProfileGroupVisible }: ProfileGroupModalProps) {

  const handleOutsideClick = (e: any) => {
    if (e.target.id === 'profileGroup__modal')
      setProfileGroupVisible(false);
  };

  return (
    <div id='profileGroup__modal' className='profileGroup__modal' onClick={handleOutsideClick}>
      <div className='profileGroup__modal__container'>
        <div className='profileGroup__modal__container__content'>
          <ProfileGroup id={id} />
        </div>
        <div className='profileGroup__modal__container__closeButton__div' >
          <button className='profileGroup__modal__container__closeButton'
            onClick={() => setProfileGroupVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}