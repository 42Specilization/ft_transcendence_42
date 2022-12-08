import './ProfileUser.scss';
import { useState, useContext, SetStateAction, Dispatch, useEffect } from 'react';
import { useQuery } from 'react-query';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ProfileUserGeneral } from './ProfileUserGeneral/ProfileUserGeneral';
import { ProfileUserHistoric } from './ProfileUserHistoric/ProfileUserHistoric';

interface ProfileUserProps {
  login: string | undefined;
  setProfileUserVisible: Dispatch<SetStateAction<string>>;
}

export function ProfileUser({ login, setProfileUserVisible }: ProfileUserProps) {

  const { api, config, updateUserProfile } = useContext(GlobalContext);
  const [updateQuery, setUpdateQuery] = useState(0);
  const [tabSelected, setTabSelected] = useState('General');

  useEffect(() => {
    if (updateUserProfile.login === login) {
      setUpdateQuery(updateUserProfile.change);
    }
  }, [updateUserProfile]);

  const { data, status } = useQuery(
    ['profileUser', updateQuery, login],
    async () => {
      const response = await api.patch('/user/profile', { nick: login }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (status == 'loading')
    return <></>;

  if (!data)
    return <></>;

  return (
    <>
      <nav className='profileUser__header'>
        <ul className='profileUser__header__list'>
          <li className={`profileUser__header__list__item
          ${tabSelected === 'General' ? 'profileUser__item__selected' : ''}`}>
            <button onClick={() => setTabSelected('General')}>
              General
            </button>
          </li>
          <li className={`profileUser__header__list__item
          ${tabSelected === 'Historic' ? 'profileUser__item__selected' : ''}`}>
            <button onClick={() => setTabSelected('Historic')}>
              Historic
            </button>
          </li>
        </ul>
      </nav>
      <div className='profileUser__body'>
        {(() => {
          if (tabSelected === 'General')
            return <ProfileUserGeneral setProfileUserVisible={setProfileUserVisible} profileUserData={data} />;
          if (tabSelected === 'Historic')
            return <ProfileUserHistoric login={data.login} />;
        })()}
      </div>
    </>
  );
}
