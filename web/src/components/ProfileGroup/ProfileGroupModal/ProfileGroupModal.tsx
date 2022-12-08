import './ProfileGroupModal.scss';
import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ProfileGroup } from '../ProfileGroup';

interface ProfileGroupModalProps {
  id: string | undefined;
  setProfileGroupVisible: Dispatch<SetStateAction<string>>;
}

export function ProfileGroupModal({ id, setProfileGroupVisible }: ProfileGroupModalProps) {
  useEffect(() => {
    const close = (event: any) => { if (event.keyCode === 27) setProfileGroupVisible(''); };
    window.addEventListener('keydown', close, true);
    return (() => window.removeEventListener('keydown', close, true));
  }, []);

  const handleOutsideClick = (e: any) => {
    if (e.target.id === 'profileGroup__modal')
      setProfileGroupVisible('');
  };

  return (
    <div id='profileGroup__modal' className='profileGroup__modal' onClick={handleOutsideClick}>
      <div className='profileGroup__modal__container'>
        <div className='profileGroup__modal__container__content'>
          <ProfileGroup setProfileGroupVisible={setProfileGroupVisible} id={id} />
        </div>
        <div className='profileGroup__modal__container__closeButton__div' >
          <button className='profileGroup__modal__container__closeButton'
            onClick={() => setProfileGroupVisible('')}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}