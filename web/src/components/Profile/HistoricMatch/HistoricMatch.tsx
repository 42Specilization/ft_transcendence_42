import { formatDate, getUrlImage } from '../../../others/utils/utils';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
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
  const [friendProfileVisible, setProfileUserVisible] = useState(false);

  return (
    <>
      <div className='historicMatch'>
        <div
          className='historicMatch__player'
          onClick={() => setProfileUserVisible(true)}>
          <img src={getUrlImage(image_url)} alt='user image' />
          <div className='historicMatch__player__nick'>{nick}</div>
        </div>
        <p className='historicMatch__infos'>{formatDate(date)}</p>
        <p className='historicMatch__infos'>{result}</p>
      </div >
      {
        friendProfileVisible &&
        <ProfileUserModal
          login={nick}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}
