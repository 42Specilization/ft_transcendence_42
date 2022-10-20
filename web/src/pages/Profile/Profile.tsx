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
    usual_full_name: 'ft_transcendence'
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  return (
    <div className="profile">
      <NavBar name={intraData.login} imgUrl={intraData.image_url} />
      <ProfileCard
        email={intraData.email}
        image_url={intraData.image_url}
        login={intraData.login}
        full_name={intraData.usual_full_name}
      />
    </div >
  );
}
