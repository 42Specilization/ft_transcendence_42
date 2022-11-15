import './ProfileGeneral.scss';
import {ProfileCard} from './ProfileCard';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface ProfileGeneralProps {

}

export  function ProfileGeneral({ }: ProfileGeneralProps) {

  const { intraData } = useContext(IntraDataContext);

  return (
    <div className='profile__general'>
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
  );
}