import './ProfileUserHistoric.scss';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { useQuery } from 'react-query';
import { ProfileUserHistoricMatch } from '../ProfileUserHistoricMatch/ProfileUserHistoricMatch';

interface ProfileUserHistoricProps {
  login: string
}

export function ProfileUserHistoric({ login }: ProfileUserHistoricProps) {
  const { api, config } = useContext(IntraDataContext);
  const { data, status } = useQuery(
    'friendHistoric',
    async () => {
      const response = await api.patch('/user/historic', { login: login }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  if (status == 'error')
    return <>Error loading friend historic, reload friend profile</>;

  return (
    <div className='profileUser__historic'>
      <div className='profileUser__historic__header'>
        <p className='profileUser__historic__header__item'>Player</p>
        <p className='profileUser__historic__header__item'>Date</p>
        <p className='profileUser__historic__header__item'>Result</p>
      </div>
      <div className='profileUser__historic__body'>
        {data && data.map((opponent: any) => (
          <ProfileUserHistoricMatch key={Math.random()} opponentData={opponent} />
        ))}
      </div>
    </div >
  );
}
