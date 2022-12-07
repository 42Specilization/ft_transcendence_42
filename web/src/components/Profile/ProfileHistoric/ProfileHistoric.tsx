import './ProfileHistoric.scss';
import { HistoricMatch } from '../HistoricMatch/HistoricMatch';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useQuery } from 'react-query';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';

export function ProfileHistoric() {

  const { updateUserProfile } = useContext(GlobalContext);
  const { intraData, api, config } = useContext(GlobalContext);
  const [profileUserVisible, setProfileUserVisible] = useState('');

  useEffect(() => {
    if (updateUserProfile.newLogin && updateUserProfile.login === profileUserVisible) {
      setProfileUserVisible(updateUserProfile.newLogin);
    }
  }, [updateUserProfile]);

  const { data } = useQuery(
    'userHistoric',
    async () => {
      const response = await api.patch('/user/historic', { login: intraData.login }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div className='profile__historic'>
        <div className='profile__historic__header'>
          <p className='profile__historic__header__item'>Player</p>
          <p className='profile__historic__header__item'>Date</p>
          <p className='profile__historic__header__item'>Result</p>
        </div>
        <div className='profile__historic__body'>
          {data && data.map((index: any) => (
            <HistoricMatch
              key={Math.random()}
              image_url={index.opponent.imgUrl}
              nick={index.opponent.login}
              date={index.date}
              result={index.result}
              setProfileUserVisible={setProfileUserVisible}
            />
          ))}
        </div>
      </div >
      {
        profileUserVisible !== '' &&
        <ProfileUserModal
          login={profileUserVisible}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}
