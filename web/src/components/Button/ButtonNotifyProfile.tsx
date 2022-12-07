import './Button.scss';
import { User, UserList } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { ProfileGroupModal } from '../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { ProfileUserModal } from '../ProfileUser/ProfileUserModal/ProfileUserModal';
import { GlobalContext } from '../../contexts/GlobalContext';

interface ButtonNotifyProfileProps {
  id: string;
  type: string;
}

export function ButtonNotifyProfile({ id, type }: ButtonNotifyProfileProps) {

  const { updateUserProfile } = useContext(GlobalContext);
  const [profileGroupVisible, setProfileGroupVisible] = useState('');
  const [profileUserVisible, setProfileUserVisible] = useState('');

  useEffect(() => {
    if (updateUserProfile.newLogin && updateUserProfile.login === profileUserVisible) {
      setProfileUserVisible(updateUserProfile.newLogin);
    }
  }, [updateUserProfile]);

  function handleShowProfile() {
    if (type === 'User')
      setProfileUserVisible(id);
    else
      setProfileGroupVisible(id);
  }

  return (
    <>
      <button className='button__icon'
        onClick={handleShowProfile}
      //data-html={true}
      //data-tooltip-content={`${type} Profile`}
      >
        {type === 'User' ?
          <User size={32} /> :
          <UserList size={32} />
        }
      </button>
      {
        profileGroupVisible !== '' &&
        <ProfileGroupModal id={id}
          setProfileGroupVisible={setProfileGroupVisible} />
      }
      {
        profileUserVisible !== '' &&
        <ProfileUserModal login={id}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}