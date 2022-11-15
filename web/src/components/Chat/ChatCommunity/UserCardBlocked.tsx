import './UserCardBlocked.scss';
import { BlockedData } from '../../../Interfaces/interfaces';

interface UserCardBlockedProps {
  blocked: BlockedData;
}

export function UserCardBlocked({ blocked }: UserCardBlockedProps) {

  return (
    <div className='user__card__blocked' >
      <div
        className='user__card__blocked__icon'
        style={{ backgroundImage: `url(${blocked.image_url})` }}>
      </div>
      <div className='user__card__blocked__name'>{blocked.login}</div>
    </div>
  );
}
