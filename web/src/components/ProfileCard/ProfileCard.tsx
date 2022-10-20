import React from 'react';
import './ProfileCard.scss';
import { Link } from 'react-router-dom';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
}

export function ProfileCard({ email, image_url, login, full_name }:ProfileCardProps) {
  return (
    <div className="profileCard">
      <div>
        <img className="profileCard__userImage" src={image_url} alt="User Image" />
      </div>
      <div className="profileCard__infos">
        <strong className="profileCard__infos__name">{full_name}</strong><br/>
        <strong className="profileCard__infos__email">{email}</strong><br/>
        <div className="profileCard__infos__nick">
          <div>
            <strong>{login}</strong>
          </div>
          <div>
            <Link to='/profile/updateNick'
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
