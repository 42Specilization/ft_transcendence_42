import './ProfileUser.scss';
import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ProfileUserGeneral } from './ProfileUserGeneral/ProfileUserGeneral';
import { ProfileUserHistoric } from './ProfileUserHistoric/ProfileUserHistoric';

interface ProfileUserProps {
  login: string | undefined;
}

export function ProfileUser({ login }: ProfileUserProps) {

  const [tabSelected, setTabSelected] = useState('General');
  const { api, config } = useContext(IntraDataContext);

  const { data, status } = useQuery(
    ['profileUser'],
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
            return <ProfileUserGeneral profileUserData={data} />;
          if (tabSelected === 'Historic')
            return <ProfileUserHistoric login={data.login} />;
        })()}
      </div>
    </>
  );
}
