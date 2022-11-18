import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { FriendProfile } from '../../components/FriendProfile/FriendProfile';
import './ProfileFriendsModal.scss';

interface ProfileFriendModalProps {
  login: string;
  setFriendProfileVisible: Dispatch<SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function ProfileFriendModal({ login, setFriendProfileVisible }: ProfileFriendModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'friend_modal')
      setFriendProfileVisible(false);
  };

  return (
    <div id='friend_modal' className='profile__friends__modal' onClick={handleOutsideClick}>
      <div className="profile__friends__modal__container">
        <div className="profile__friends__modal__container__content">
          <FriendProfile login={login} />
        </div>
        <div className='profile__friends__modal__container__closeButton__div' >
          <button className="profile__friends__modal__container__closeButton"
                  onClick={()=> setFriendProfileVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}