import './ProfileHistoric.scss';
import HistoricMatch from './HistoricMatch';
import { IntraData } from '../../../Interfaces/interfaces';

interface ProfileHistoricProps {
  intraData: IntraData;
}

export default function ProfileHistoric({ intraData }: ProfileHistoricProps) {

  return (
    <div className="profile__historic">
      <div className="profile__historic__header">
        <p className="profile__historic__header__item">Player</p>
        <p className="profile__historic__header__item">Date</p>
        <p className="profile__historic__header__item">Result</p>
      </div>
      <div className="profile__historic__body">
        {[...Array(20).keys()].map((index) => (
          <HistoricMatch
            key={intraData.login + index}
            image_url={intraData.image_url}
            nick={intraData.login}
            date="12/12/22"
            result="win/lose 10X1"
          />
        ))}
      </div>
    </div >
  );
}
