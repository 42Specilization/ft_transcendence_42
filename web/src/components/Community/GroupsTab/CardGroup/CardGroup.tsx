import './CardGroup.scss';
import { LockKey, Shield } from 'phosphor-react';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { GroupCardData } from '../../../../others/Interfaces/interfaces';
import { ProfileGroupModal } from '../../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { getUrlImage } from '../../../../others/utils/utils';

interface CardGroupProps {
  group: GroupCardData;
}

export function CardGroup({ group }: CardGroupProps) {

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
        <ReactTooltip delayShow={50} />
      </div >
      {profileGroupVisible &&
        <ProfileGroupModal id={group.id} setProfileGroupVisible={setProfileGroupVisible} />
      }
    </>
  );
}