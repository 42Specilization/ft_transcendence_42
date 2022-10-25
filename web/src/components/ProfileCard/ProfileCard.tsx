import React, { Dispatch, SetStateAction } from 'react';
import './ProfileCard.scss';
import { Link } from 'react-router-dom';
import { UserImage } from '../UserImage/UserImage';
import { IntraData } from '../../Interfaces/interfaces';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
    setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function ProfileCard({ email, image_url, login, full_name, setIntraData }:ProfileCardProps) {
  return (
    <div className="profileCard">
      <div className="profileCard__userImage" >
        <UserImage
          image_url={image_url}
          login={login}
          setIntraData={setIntraData}
        ></UserImage>
      </div>
      <div className="profileCard__infos">
        <strong className="profileCard__infos__name">{full_name}</strong><br/>
        <strong className="profileCard__infos__email">{email}</strong><br/>
        <div className="profileCard__infos__nick">
          <div>
            <strong>{login}</strong>
          </div>
          <div>
            <Link to='/updateNick'
              onClick={() =>console.log('Hello')}
              className="profileCard__infos__changeNickButton"
            >
              Change Nickname
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
