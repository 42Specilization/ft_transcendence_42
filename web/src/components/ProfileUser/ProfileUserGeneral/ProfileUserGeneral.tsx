import './ProfileUserGeneral.scss';
import { ProfileUserCard } from '../ProfileUserCard/ProfileUserCard';
import { Dispatch, SetStateAction } from 'react';

interface ProfileUserGeneralProps {
  profileUserData: {
    status: string,
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
    relation: string,
  };
  setProfileUserVisible: Dispatch<SetStateAction<boolean>>;
}

export function ProfileUserGeneral({ profileUserData, setProfileUserVisible }: ProfileUserGeneralProps) {

  const { matches, wins, lose } = profileUserData;

  return (
    <div className='profileUser__general'>
      <div className='profileUser__general__grid'>
        <ProfileUserCard setProfileUserVisible={setProfileUserVisible} profileUserData={profileUserData} />
        <div className='profileUser__general__stats'>
          <div className='profileUser__general__stats__title'>
            <p>Stats</p>
          </div>
          <div className='profileUser__general__stats__infos'>
            <p>Matches:</p> <p>{matches}</p>
          </div>
          <div className='profileUser__general__stats__infos'>
            <p>Wins:</p> <p>{wins}</p>
          </div>
          <div className='profileUser__general__stats__infos'>
            <p>Lose:</p> <p>{lose}</p>
          </div>
          <div className='profileUser__general__stats__infos'>
            <p>Ratio W/L:</p>
            <p>
              {(Number(wins) / (Number(lose) > 0 ? Number(lose) : 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}