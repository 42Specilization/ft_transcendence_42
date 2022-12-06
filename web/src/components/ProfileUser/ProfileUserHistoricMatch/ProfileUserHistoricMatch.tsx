import './ProfileUserHistoricMatch.scss';
import { formatDate, getUrlImage } from '../../../others/utils/utils';

interface ProfileUserHistoricMatchProps {
  opponentData: {
    date: string;
    result: string;
    opponent:{
      nick: string;
      imgUrl: string;
    }
  }
}

export function ProfileUserHistoricMatch({ opponentData }: ProfileUserHistoricMatchProps) {

  const { date, result, opponent } = opponentData;

  return (
    <div className='profileUser__historicMatch'>
      <div className='profileUser__historicMatch__player'>
        <img src={getUrlImage(opponent.imgUrl)} alt='user image' />
        <div className='profileUser__historicMatch__player__nick'>{opponent.nick}</div>
      </div>
      <p className='profileUser__historicMatch__infos'>{formatDate(date)}</p>
      <p className='profileUser__historicMatch__infos'>{result}</p>
    </div >
  );
}
