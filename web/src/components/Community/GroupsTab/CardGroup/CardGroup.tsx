import './CardGroup.scss';
import { LockKey, Shield } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
//import { Tooltip } from 'react-tooltip';
import { GroupCardData } from '../../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../../others/utils/utils';

interface CardGroupProps {
  group: GroupCardData;
  setProfileGroupVisible: Dispatch<SetStateAction<string>>;
}

export function CardGroup({ group, setProfileGroupVisible }: CardGroupProps) {

  function selectProfileGroupVisible(e: any) {
    if (e.target.id === 'card__group__community') {
      setProfileGroupVisible(group.id);
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
              //data-html={true}
              //data-tooltip-content={'Private Group'} 
              />;
            }
            else if (group.type === 'protected')
              return <Shield size={32}
              //data-html={true}
              //data-tooltip-content={'Protected Group'} 
              />;
          })()}
        </div>
        {/* <Tooltip delayShow={50} /> */}
      </div >
    </>
  );
}