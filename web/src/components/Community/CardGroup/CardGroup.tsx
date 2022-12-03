import './CardGroup.scss';
import { LockKey, Shield } from 'phosphor-react';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { GroupCardData } from '../../../others/Interfaces/interfaces';
import { ProfileGroupModal } from '../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonSendMessage } from '../../Button/ButtonSendMessage';
import { ButtonLeaveGroup } from '../../Button/ButtonLeaveGroup';
import { ButtonJoinGroup } from '../../Button/ButtonJoinGroup';
import { ButtonMenu } from '../../Button/ButtonMenu';

interface CardGroupProps {
  group: GroupCardData;
}

export function CardGroup({ group }: CardGroupProps) {

  const [activeMenu, setActiveMenu] = useState(false);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);

  function selectProfileGroupVisible(e: any) {
    if (e.target.id === 'card__group__community') {
      setProfileGroupVisible((prev) => !prev);
    }
  }

  return (
    <>
      <div id='card__group__community' className='card__group__community'
        onClick={(e) => selectProfileGroupVisible(e)}
      >
        <div id='card__group__community' className='card__group__community__icon'
          style={{ backgroundImage: `url(${getUrlImage(group.image)})` }}>
        </div>
        <div id='card__group__community' className='card__group__community__name'>{group.name}</div>

        <div className='card__group__community__menu__div'>
          <div style={{ paddingRight: '20px' }}>
            {(() => {
              if (group.type === 'private') {
                return <LockKey size={32}
                  data-html={true}
                  data-tip={'Private Group'} />;
              }
              else if (group.type === 'protected')
                return <Shield size={32}
                  data-html={true}
                  data-tip={'Protected Group'} />;
            })()}
          </div>

          <div className='card__group__community__menu'>
            {group.member ?
              <div id='card__group__community__menu__body' className='card__group__community__menu__body'
                style={{ height: activeMenu ? '100px' : '0px', width: activeMenu ? '80px' : '0px' }}>
                <ButtonSendMessage id={group.id} type={'group'} />
                <ButtonLeaveGroup id={group.id} />
              </div>
              :
              <div id='card__group__community__menu__body' className='card__group__community__menu__body'
                style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
                <ButtonJoinGroup id={group.id} type={group.type} />
              </div>
            }
            <ButtonMenu setActiveMenu={setActiveMenu} />

          </div>
          <ReactTooltip delayShow={50} />
          {profileGroupVisible &&
            <ProfileGroupModal id={group.id} setProfileGroupVisible={setProfileGroupVisible} />
          }
        </div>
      </div >
    </>
  );
}