import React, { Dispatch, SetStateAction } from 'react';
import './ProfileCard.scss';
import { UserImage } from '../UserImage/UserImage';
import { IntraData } from '../../Interfaces/interfaces';
import { NotePencil } from 'phosphor-react';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
    setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function ProfileCard({ email, image_url, login, full_name, setIntraData }:ProfileCardProps) {
  function handleClick() {
    window.location.href = '/updateNick';
  }

  return (
    <div className="profileCard">
      <UserImage
        image_url={image_url}
        login={login}
        setIntraData={setIntraData}
      ></UserImage>
      <strong className="profileCard__infos__name">{full_name}</strong><br/>
      <strong className="profileCard__infos__email">{email}</strong><br/>
      <div className="profileCard__infos__nick">
        <div>
          <strong>{login}</strong>
        </div>
        <div className='profileCard__infos__button'>
          <NotePencil size={32} onClick={handleClick}/>
        </div>
      </div>
    </div >
  );
}
