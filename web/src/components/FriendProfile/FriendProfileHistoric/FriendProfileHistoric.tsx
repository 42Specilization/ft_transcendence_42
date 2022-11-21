import './FriendProfileHistoric.scss';
import { FriendHistoricMatch } from './FriendHistoricMatch';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface FriendProfileHistoricProps {
friendData: {
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
}}

export function FriendProfileHistoric({friendData }: FriendProfileHistoricProps) {
  const {  api, config} = useContext(IntraDataContext);
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
        const result = await api.patch('/user/historic', {login: friendData.login}, config);
        console.log(result.data);
        setHistoric(result.data);

      } catch (err){
        console.log(err);
      }
    }
    getHistoric();
  },[]);
  
  return (
    <div className='friendProfile__historic'>
      <div className='friendProfile__historic__header'>
        <p className='friendProfile__historic__header__item'>Player</p>
        <p className='friendProfile__historic__header__item'>Date</p>
        <p className='friendProfile__historic__header__item'>Result</p>
      </div>
      <div className='friendProfile__historic__body'>
        {historic && historic.map((index) => (
          <FriendHistoricMatch
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
