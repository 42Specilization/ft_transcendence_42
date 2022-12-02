import './CardBlocked.scss';
import { BlockedData } from '../../../others/Interfaces/interfaces';

import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { getUrlImage } from '../../../others/utils/utils';
import { ConfirmActionModal } from '../../ConfirmActionModal/ConfirmActionModal';
import { ButtonUnBlockedUser } from '../../Button/ButtonUnBlockedUser';

interface CardBlockedProps {
  blocked: BlockedData;
}

export function CardBlocked({ blocked }: CardBlockedProps) {

  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const { setIntraData, api, config } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState('');

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
    <>
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
            <ButtonUnBlockedUser login={blocked.login} />
          </div>
        </div>
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div>
      {
        (() => {
          if (confirmActionVisible === 'removeBlock') {
            return <ConfirmActionModal
              title={'Unblock user?'}
              onClose={() => setConfirmActionVisible('')}
              confirmationFunction={handleUnblock}
            />;
          }
        })()
      }
    </>
  );
}
