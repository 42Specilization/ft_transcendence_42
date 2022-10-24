import axios from 'axios';
import { useEffect, useState } from 'react';
import { ErrorComponent } from '../../components/ErrorComponent/ErrorComponent';
import { NavBar } from '../../components/NavBar/NavBar';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../Home/Home';
import './ProfileUpdateImage.scss';

export default function ProfileUpdateImage(){
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
    <>
      <div className="profile">

        <NavBar name={intraData.login} imgUrl={intraData.image_url} />
        <ProfileCard
          email={intraData.email}
          image_url={intraData.image_url}
          login={intraData.login}
          full_name={intraData.usual_full_name}
        />
      </div>
    </>
  );
}
