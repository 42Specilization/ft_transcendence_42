import './ProfileHistoric.scss';
import { HistoricMatch } from '../HistoricMatch/HistoricMatch';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { useQuery } from 'react-query';

export function ProfileHistoric() {
  const { intraData, api, config } = useContext(IntraDataContext);
  const { data } = useQuery(
    'userHistoric',
    async () => {
      const response = await api.patch('/user/historic', { login: intraData.login }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div className='profile__historic'>
      <div className='profile__historic__header'>
        <p className='profile__historic__header__item'>Player</p>
        <p className='profile__historic__header__item'>Date</p>
        <p className='profile__historic__header__item'>Result</p>
      </div>
      <div className='profile__historic__body'>
        {data && data.map((index: any) => (
          <HistoricMatch
            key={crypto.randomUUID()}
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
