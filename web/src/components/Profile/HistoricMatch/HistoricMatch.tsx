import { formatDate, getUrlImage } from '../../../others/utils/utils';
import './HistoricMatch.scss';
import { Dispatch, SetStateAction } from 'react';

interface HistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
  setProfileUserVisible: Dispatch<SetStateAction<string>>;
}

export function HistoricMatch({
  nick,
  date,
  result,
  image_url,
  setProfileUserVisible,
}: HistoricMatchProps) {
  return (
    <div className='historicMatch'>
      <div
        className='historicMatch__player'
        onClick={() => setProfileUserVisible(nick)}>
        <img src={getUrlImage(image_url)} alt='user image' />
        <div className='historicMatch__player__nick'>{nick}</div>
      </div>
      <p className='historicMatch__infos'>{formatDate(date)}</p>
      <p className='historicMatch__infos'>{result}</p>
    </div >
  );
}
