import './ProfileUserModal.scss';
import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { ProfileUser } from '../ProfileUser';

interface ProfileUserModalProps {
  login: string | undefined;
  setProfileUserVisible: Dispatch<SetStateAction<boolean>>;
}

export function ProfileUserModal({ login, setProfileUserVisible }: ProfileUserModalProps) {

  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'profileUser__modal')
      setProfileUserVisible(false);
  };

  return (
    <div id='profileUser__modal' className='profileUser__modal' onClick={handleOutsideClick}>
      <div className="profileUser__modal__container">
        <div className="profileUser__modal__container__content">
          <ProfileUser login={login} />
        </div>
        <div className='profileUser__modal__container__closeButton__div' >
          <button className="profileUser__modal__container__closeButton"
            onClick={() => setProfileUserVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}