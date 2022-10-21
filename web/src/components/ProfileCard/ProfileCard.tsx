import React from 'react';
import './ProfileCard.scss';
import { Link } from 'react-router-dom';
import { UserImage } from '../UserImage/UserImage';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
}

export function ProfileCard({ email, image_url, login, full_name }:ProfileCardProps) {
  return (
    <div className="profileCard">
      <UserImage image_url={image_url}/>
      <div className="profileCard__infos">
        <strong className="profileCard__infos__name">{full_name}</strong><br/>
        <strong className="profileCard__infos__email">{email}</strong><br/>
        <div className="profileCard__infos__nick">
          <div>
            <strong>{login}</strong>
          </div>
          <div>
            <Link to='/profile/updateNick'
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
