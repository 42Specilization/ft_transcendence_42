import './FriendProfileGeneral.scss';
import { FriendCard } from './FriendCard';

interface FriendProfileGeneralProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
  }
}

export function FriendProfileGeneral({ friendData }: FriendProfileGeneralProps) {

  return (
    <div className='friendProfile__general'>
      <FriendCard friendData={{
        name: friendData.name,
        login: friendData.login,
        image_url: friendData.image_url,
      }} />
      
      <div className='friendProfile__general__stats'>
        <div className='friendProfile__general__stats__title'>
          <p>Stats</p>
        </div>
        <div className='friendProfile__general__stats__infos'>
          <p>Matches:</p>
          <p>{friendData.matches}</p>
        </div>
        <div className='friendProfile__general__stats__infos'>
          <p>Wins:</p>
          <p>{friendData.wins}</p>
        </div>
        <div className='friendProfile__general__stats__infos'>
          <p>Lose:</p>
          <p>{friendData.lose}</p>
        </div>
        <div className='friendProfile__general__stats__infos'>
          <p>Ratio W/L:</p>
          <p>
            {(
              Number(friendData.wins) /
              (Number(friendData.lose) > 0 ? Number(friendData.lose) : 1)
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}