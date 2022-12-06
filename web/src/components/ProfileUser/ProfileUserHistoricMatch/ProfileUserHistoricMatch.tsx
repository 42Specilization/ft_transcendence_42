import './ProfileUserHistoricMatch.scss';
import { formatDate, getUrlImage } from '../../../others/utils/utils';

interface ProfileUserHistoricMatchProps {
  opponentData: {
    date: string;
    result: string;
    opponent: {
      login: string;
      imgUrl: string;
    }
  }
}

export function ProfileUserHistoricMatch({ opponentData }: ProfileUserHistoricMatchProps) {
  const { result, date, opponent } = opponentData;
  return (
    <div className='profileUser__historicMatch'>
      <div className='profileUser__historicMatch__player'>
        <img src={getUrlImage(opponent.imgUrl)} alt='user image' />
        <div className='profileUser__historicMatch__player__nick'>{opponent.login}</div>
      </div>
      <p className='profileUser__historicMatch__infos'>{formatDate(date)}</p>
      <p className='profileUser__historicMatch__infos'>{result}</p>
    </div >
  );
}
