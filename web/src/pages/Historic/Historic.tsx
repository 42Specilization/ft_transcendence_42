import { useEffect, useState } from 'react';
import { HistoricMatch } from '../../components/HistoricMatch/HistoricMatch';
import { NavBar } from '../../components/NavBar/NavBar';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../Home/Home';
import './Historic.scss';

export default function Historic() {
  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence',
    matches: '0',
    wins: '0',
    lose: '0',
    isTFAEnable: false,
    tfaValidated: false,
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  return (
    <div className="historic">
      <div className='historic__header'>
        <div className="historic__header__title">
          <p className='historic__title'><span>Historic</span></p>
        </div>
        <div className="historic__columns">
          <p className='historic__nick__text'><span>Player</span></p>
          <p className='historic__date__text'><span>Date</span></p>
          <p className='historic__result__text'><span>Result</span></p>
        </div>
      </div>
      <HistoricMatch
        image_url={intraData.image_url}
        nick={intraData.login}
        date='12/12/22'
        result='win/lose 10X1'
      />
      <HistoricMatch
        image_url={intraData.image_url}
        nick={intraData.login}
        date='12/12/22'
        result='win/lose 10X1'
      />
      <HistoricMatch
        image_url={intraData.image_url}
        nick={intraData.login}
        date='12/12/22'
        result='win/lose 10X1'
      />
      <HistoricMatch
        image_url={intraData.image_url}
        nick={intraData.login}
        date='12/12/22'
        result='win/lose 10X1'
      />
      <NavBar name={intraData.login} imgUrl={intraData.image_url} />
    </div>
  );
}
