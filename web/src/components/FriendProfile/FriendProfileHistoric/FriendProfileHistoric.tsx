import './FriendProfileHistoric.scss';
import { FriendHistoricMatch } from './FriendHistoricMatch';

interface FriendProfileHistoricProps {
friendData: {
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
}}

export function FriendProfileHistoric({friendData }: FriendProfileHistoricProps) {

  return (
    <div className='friendProfile__historic'>
      <div className='friendProfile__historic__header'>
        <p className='friendProfile__historic__header__item'>Player</p>
        <p className='friendProfile__historic__header__item'>Date</p>
        <p className='friendProfile__historic__header__item'>Result</p>
      </div>
      <div className='friendProfile__historic__body'>
        {[...Array(20).keys()].map((index) => (
          <FriendHistoricMatch
            key={friendData.login + index}
            image_url={friendData.image_url}
            nick={friendData.login}
            date='12/12/22'
            result='win/lose 10X1'
          />
        ))}
      </div>
    </div >
  );
}
