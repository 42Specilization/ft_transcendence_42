import './Profile.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import React from 'react';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { getStoredData } from '../Home/Home';

export default function Profile() {
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

  useEffect(()=>{
    window.localStorage.removeItem('userData');
    getStoredData(setIntraData);
  }, []);

  return (
    <div className="profile">
      <ProfileCard
        email={intraData.email}
        image_url={intraData.image_url}
        login={intraData.login}
        full_name={intraData.usual_full_name}
        setIntraData={setIntraData}
      />
      <div className='profile__stats'>
        <div className='profile__stats__title'>
          <p >Stats</p>
        </div>
        <div className='profile__stats__matches'>
          <span>Matches:</span>
          <a>{intraData.matches}</a>
        </div>
        <div className='profile__stats__wins'>
          <a>Wins:</a>
          <a>{intraData.wins}</a>
        </div>
        <div className='profile__stats__lose'>
          <a>Lose:</a>
          <a>{intraData.lose}</a>
        </div>
        <div className='profile__stats__ratio'>
          <a>Ratio W/L:</a>
          <a>{Number(intraData.wins) / (Number(intraData.lose) > 0 ? Number(intraData.lose) : 1)}</a>
        </div>
      </div>
      <NavBar name={intraData.login} imgUrl={intraData.image_url} />
    </div >
  );
}
