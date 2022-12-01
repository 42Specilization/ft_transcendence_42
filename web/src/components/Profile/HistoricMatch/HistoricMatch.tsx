import { formatDate, getUrlImage } from '../../../others/utils/utils';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import './HistoricMatch.scss';
import { useState } from 'react';

interface HistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
}

export function HistoricMatch({
  nick,
  date,
  result,
  image_url,
}: HistoricMatchProps) {
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);

  return (
    <div className='historicMatch'>
      <div
        className='historicMatch__player'
        onClick={() => setFriendProfileVisible(true)}>
        <img src={getUrlImage(image_url)} alt='user image' />
        <div className='historicMatch__player__nick'>{nick}</div>
      </div>
      <p className='historicMatch__infos'>{formatDate(date)}</p>
      <p className='historicMatch__infos'>{result}</p>
      {friendProfileVisible &&
        <ProfileFriendModal
          login={nick}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
    </div >
  );
}
