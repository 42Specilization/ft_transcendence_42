import './FriendProfileHistoric.scss';
import { FriendHistoricMatch } from './FriendHistoricMatch';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { useQuery } from 'react-query';

interface FriendProfileHistoricProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
  }
}

export function FriendProfileHistoric({ friendData }: FriendProfileHistoricProps) {
  const { api, config } = useContext(IntraDataContext);
  const { data, status } = useQuery(
    'friendHistoric',
    async () => {
      const response = await api.patch('/user/historic', { login: friendData.login }, config);
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
    <div className='friendProfile__historic'>
      <div className='friendProfile__historic__header'>
        <p className='friendProfile__historic__header__item'>Player</p>
        <p className='friendProfile__historic__header__item'>Date</p>
        <p className='friendProfile__historic__header__item'>Result</p>
      </div>
      <div className='friendProfile__historic__body'>
        {data && data.map((index: any) => (
          <FriendHistoricMatch
            key={Math.random()}
            image_url={index.opponent.imgUrl}
            nick={index.opponent.login}
            date={index.date}
            result={index.result}
          />
        ))}
      </div>
    </div >
  );
}
