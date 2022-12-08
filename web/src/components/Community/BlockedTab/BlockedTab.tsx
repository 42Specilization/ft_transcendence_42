import './BlockedTab.scss';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { CardUser } from '../../CardUser/CardUser';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { UserData } from '../../../others/Interfaces/interfaces';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';

export function BlockedTab() {
  const { globalData, updateUserProfile } = useContext(GlobalContext);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [profileUserVisible, setProfileUserVisible] = useState('');

  useEffect(() => {
    if (updateUserProfile.newLogin && updateUserProfile.login === profileUserVisible) {
      setProfileUserVisible(updateUserProfile.newLogin);
    }
  }, [updateUserProfile]);

  return (
    <>
      <div className='blocked__tab' >
        <div
          className='blocked__tab__header'>
          <ButtonSearch
            width={'70%'}
            tooltip={'Search Blocked'}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchActive={searchActive}
            setSearchActive={setSearchActive} />
        </div>
        <div className='blocked__tab__body'>
          {globalData.blocked?.filter((obj: UserData) => obj.login.includes(searchInput))
            .map((obj: UserData) =>
              <CardUser
                key={Math.random()}
                user={obj}
                menuHeight={0}
                setProfileUserVisible={setProfileUserVisible}>
              </CardUser>)
          }
        </div>
      </div >
      {profileUserVisible !== '' &&
        <ProfileUserModal login={profileUserVisible}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}
