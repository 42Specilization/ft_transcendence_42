import './ProfileHistoric.scss';
import  { HistoricMatch } from '../HistoricMatch/HistoricMatch';
import { useContext, useState, useEffect } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

export function ProfileHistoric() {
  const { intraData, api, config} = useContext(IntraDataContext);

  const defaultHistoric = {
    date:'now',
    opponent :{ 
      imgUrl:'nop',
      login:'n',
    },
    result:'result'
  };

  const [historic, setHistoric] = useState([defaultHistoric]);

  useEffect(() => {
    async function getHistoric() {
      try {
        const result = await api.patch('/user/historic', {login: intraData.login}, config);
        console.log(result.data);
        setHistoric(result.data);

      } catch (err){
        console.log(err);
      }
    }
    getHistoric();
  },[]);


  return (
    <div className='profile__historic'>
      <div className='profile__historic__header'>
        <p className='profile__historic__header__item'>Player</p>
        <p className='profile__historic__header__item'>Date</p>
        <p className='profile__historic__header__item'>Result</p>
      </div>
      <div className='profile__historic__body'>
        {historic && historic.map((index) => (
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
