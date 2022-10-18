import React from 'react';
import './ProfileCard.scss';
import PropTypes from 'prop-types';

export default function ProfileCard({email, image_url, login, full_name}) {

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
            <strong >{login}</strong>
          </div>
          <div>
            <button onClick={() =>console.log('Hello')} className="profileCard__infos__changeNickButton">Change Nickname</button>
          </div>
        </div>
      </div>
    </div >
  );
}

ProfileCard.propTypes = {
  email: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  full_name: PropTypes.string.isRequired,
};
