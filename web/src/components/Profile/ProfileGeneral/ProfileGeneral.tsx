import './ProfileGeneral.scss';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

export function ProfileGeneral() {

  const { intraData } = useContext(GlobalContext);

  return (
    <div className='profile__general'>
      <div className='profile__general__grid'>
        <ProfileCard />
        <div className='profile__general__stats'>
          <div className='profile__general__stats__title'>
            <p>Stats</p>
          </div>
          <div className='profile__general__stats__infos'>
            <p>Matches:</p>
            <p>{intraData.matches}</p>
          </div>
          <div className='profile__general__stats__infos'>
            <p>Wins:</p>
            <p>{intraData.wins}</p>
          </div>
          <div className='profile__general__stats__infos'>
            <p>Lose:</p>
            <p>{intraData.lose}</p>
          </div>
          <div className='profile__general__stats__infos'>
            <p>Ratio W/L:</p>
            <p>
              {(
                Number(intraData.wins) /
                (Number(intraData.lose) > 0 ? Number(intraData.lose) : 1)
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}