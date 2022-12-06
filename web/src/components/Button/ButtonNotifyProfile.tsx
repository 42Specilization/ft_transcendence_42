import './Button.scss';
import { User, UserList } from 'phosphor-react';
import { useState } from 'react';
import { ProfileGroupModal } from '../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { ProfileUserModal } from '../ProfileUser/ProfileUserModal/ProfileUserModal';

interface ButtonNotifyProfileProps {
  id: string;
  type: string;
}

export function ButtonNotifyProfile({ id, type }: ButtonNotifyProfileProps) {

  const [friendProfileVisible, setProfileUserVisible] = useState(false);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);

  function handleShowProfile() {
    if (type === 'User')
      setProfileUserVisible(true);
    else
      setProfileGroupVisible(true);
  }

  return (
    <>
      <button className='button__icon'
        onClick={handleShowProfile}
        data-html={true}
        data-tip={`${type} Profile`}
      >
        {type === 'User' ?
          <User size={32} /> :
          <UserList size={32} />
        }
      </button>
      {
        profileGroupVisible &&
        <ProfileGroupModal id={id}
          setProfileGroupVisible={setProfileGroupVisible} />
      }
      {
        friendProfileVisible &&
        <ProfileUserModal login={id}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}