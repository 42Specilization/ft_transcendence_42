import './ProfileUserModal.scss';
import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ProfileUser } from '../ProfileUser';

interface ProfileUserModalProps {
  login: string | undefined;
  setProfileUserVisible: Dispatch<SetStateAction<string>>;
}

export function ProfileUserModal({ login, setProfileUserVisible }: ProfileUserModalProps) {

  useEffect(() => {
    const close = (event: any) => { if (event.keyCode === 27) setProfileUserVisible(''); };
    window.addEventListener('keydown', close, true);
    return (() => window.removeEventListener('keydown', close, true));
  }, []);

  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'profileUser__modal')
      setProfileUserVisible('');
  };

  return (
    <div id='profileUser__modal' className='profileUser__modal' onClick={handleOutsideClick}>
      <div className="profileUser__modal__container">
        <div className="profileUser__modal__container__content">
          <ProfileUser login={login} setProfileUserVisible={setProfileUserVisible} />
        </div>
        <div className='profileUser__modal__container__closeButton__div' >
          <button className="profileUser__modal__container__closeButton"
            onClick={() => setProfileUserVisible('')}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}