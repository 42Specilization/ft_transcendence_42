import './CardBlocked.scss';
import { BlockedData } from '../../../others/Interfaces/interfaces';
import { UserMinus } from 'phosphor-react';
import { useContext, useMemo, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
// import { useSnapshot } from 'valtio';
// import { stateStatus } from '../../../status/statusState';
import axios from 'axios';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../adapters/status/statusState';

interface CardBlockedProps {
  blocked: BlockedData;
}

export function CardBlocked({ blocked }: CardBlockedProps) {

  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const currentStateStatus = useSnapshot(stateStatus);
  const { setIntraData } = useContext(IntraDataContext);

  const token = useMemo(() => window.localStorage.getItem('token'), []);

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const api = useMemo(() => axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  }), []);

  async function handleUnblock() {
    await api.patch('/user/removeBlocked', { nick: blocked.login }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        blockeds: prevIntraData.blockeds.filter((key) => key.login != blocked.login)
      };
    });
    currentStateStatus.socket?.emit('removeBlocked', blocked.login);
  }




  return (
    <div className='card__blocked' onClick={() => setIsTableFriendUsersMenu(prev => !prev)}>

      <div className="card__blocked__div">
        <div
          className='card__blocked__icon'
          style={{ backgroundImage: `url(${blocked.image_url})` }}>
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
