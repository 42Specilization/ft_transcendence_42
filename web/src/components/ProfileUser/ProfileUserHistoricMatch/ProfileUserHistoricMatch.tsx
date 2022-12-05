import './ProfileUserHistoricMatch.scss';
import { formatDate, getUrlImage } from '../../../others/utils/utils';

interface ProfileUserHistoricMatchProps {
  opponentData: {
    nick: string;
    date: string;
    result: string;
    image_url: string;
  }
}

export function ProfileUserHistoricMatch({ opponentData }: ProfileUserHistoricMatchProps) {

  const { nick, date, result, image_url } = opponentData;

  return (
    <div className='profileUser__historicMatch'>
      <div className='profileUser__historicMatch__player'>
        <img src={getUrlImage(image_url)} alt='user image' />
        <div className='profileUser__historicMatch__player__nick'>{nick}</div>
      </div>
      <p className='profileUser__historicMatch__infos'>{formatDate(date)}</p>
      <p className='profileUser__historicMatch__infos'>{result}</p>
    </div >
  );
}
