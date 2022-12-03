import './CardBanned.scss';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonUnBanMember } from '../../Button/ButtonUnBanMember';
import { ButtonMenu } from '../../Button/ButtonMenu';

interface CardBannedProps {
  id: string;
  banned: MemberData;
}

export function CardBanned({ id, banned }: CardBannedProps) {

  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setProfileUserVisible] = useState(false);

  function modalVisible(event: any) {
    if (event.target.id === 'card__banned')
      setProfileUserVisible(true);
  }

  return (
    <>
      <div id='card__banned' className='card__banned' onClick={modalVisible}>
        <div id='card__banned' className="card__banned__div">
          <div id='card__banned'
            className='card__banned__icon'
            style={{ backgroundImage: `url(${getUrlImage(banned.image)})` }}>
          </div>
          <div id='card__banned' className='card__banned__name'>{banned.name}</div>
        </div>

        <div className="card__banned__menu">
          <div
            className="card__banned__menu__body"
            style={{
              height: activeMenu ? '100px' : '0px',
              width: activeMenu ? '90px' : '0px'
            }}
          >
            <ButtonUnBanMember id={id} name={banned.name} />
          </div>
          <ButtonMenu setActiveMenu={setActiveMenu} />
        </div>
        <ReactTooltip delayShow={50} />
      </div>
      {friendProfileVisible &&
        <ProfileUserModal
          login={banned.name}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}
