import './ProfileGeneral.scss';
import ProfileCard from './ProfileCard';
import { IntraData } from '../../../Interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';

interface ProfileGeneralProps {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  currentStateStatus: any;
}

export default function ProfileGeneral({ intraData, setIntraData , currentStateStatus}: ProfileGeneralProps) {
  return (
    <div className='profile__general'>
      <ProfileCard
        email={intraData.email}
        image_url={intraData.image_url}
        login={intraData.login}
        full_name={intraData.usual_full_name}
        setIntraData={setIntraData}
        currentStateStatus={currentStateStatus}
      />
      <div className="profile__general__stats">
        <div className="profile__general__stats__title">
          <p>Stats</p>
        </div>
        <div className="profile__general__stats__infos">
          <p>Matches:</p>
          <p>{intraData.matches}</p>
        </div>
        <div className="profile__general__stats__infos">
          <p>Wins:</p>
          <p>{intraData.wins}</p>
        </div>
        <div className="profile__general__stats__infos">
          <p>Lose:</p>
          <p>{intraData.lose}</p>
        </div>
        <div className="profile__general__stats__infos">
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