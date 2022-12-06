import './CardGroup.scss';
import { LockKey, Shield } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import ReactTooltip from 'react-tooltip';
import { GroupCardData } from '../../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../../others/utils/utils';

interface CardGroupProps {
  group: GroupCardData;
  setGroupProfile: Dispatch<SetStateAction<string>>;
}

export function CardGroup({ group, setGroupProfile }: CardGroupProps) {

  function selectProfileGroupVisible(e: any) {
    if (e.target.id === 'card__group__community') {
      setGroupProfile(group.id);
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
    </>
  );
}