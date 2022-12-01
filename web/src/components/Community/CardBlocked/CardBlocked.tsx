import './CardBlocked.scss';
import { BlockedData } from '../../../others/Interfaces/interfaces';
import { UserMinus } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { getUrlImage } from '../../../others/utils/utils';

interface CardBlockedProps {
  blocked: BlockedData;
}

export function CardBlocked({ blocked }: CardBlockedProps) {

  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const { setIntraData, api, config } = useContext(IntraDataContext);

  async function handleUnblock() {
    await api.patch('/user/removeBlocked', { nick: blocked.login }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        blocked: prevIntraData.blocked.filter((key) => key.login != blocked.login)
      };
    });
    actionsStatus.removeBlocked(blocked.login);
  }

  return (
    <div className='card__blocked' onClick={() => setIsTableFriendUsersMenu(prev => !prev)}>

      <div className="card__blocked__div">
        <div
          className='card__blocked__icon'
          style={{ backgroundImage: `url(${getUrlImage(blocked.image_url)})` }}>
        </div>
        <div className='card__blocked__name'>{blocked.login}</div>
      </div>
      <div className="card__blocked__menu">
        <div
          className="card__blocked__menu__body"
          style={{ height: isTableFriendUsersMenu ? '55px' : '0px', width: isTableFriendUsersMenu ? '90px' : '0px' }}
        >
          <button
            className='card__blocked__menu__button'
            onClick={handleUnblock}
            data-html={true}
            data-tip={'Unblock'}
          >
            <UserMinus size={32} />
          </button>
        </div>
      </div>
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
    </div>
  );
}
