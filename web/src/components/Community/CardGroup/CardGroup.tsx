import { DotsThreeVertical, SignIn } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { GroupData } from '../../../others/Interfaces/interfaces';
import './CardGroup.scss';
import { Link } from 'react-router-dom';

interface CardGroupProps {
  group: GroupData;
}

export function CardGroup({ group }: CardGroupProps) {

  const { setGroupsChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);


  function selectActiveGroup(e: any) {
    if (e.target.id === 'card__group__community') {
      setGroupsChat(group.id);
    }
  }

  return (
    <div id='card__group__community' className='card__group__community'
      onClick={(e) => selectActiveGroup(e)}
    >
      <div id='card__group__community' className='card__group__community__icon'
        style={{ backgroundImage: `url(${group.image})` }}>
      </div>
      <div id='card__group__community' className='card__group__community__name'>{group.name}</div>

      <div className='card__group__community__menu'>
        <div id='card__group__community__menu__body' className='card__group__community__menu__body'
          style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
          <Link to='/chat' className='card__group__community__menu__button'
            onClick={() => { }}
            data-html={true}
            data-tip={'Join Group'}>
            <SignIn size={32} />
          </Link>
        </div>

        <DotsThreeVertical
          id='card__group__community__menu'
          className='card__group__community__header__icon'
          size={40}
          onClick={() => setActiveMenu(prev => !prev)}
          data-html={true}
          data-tip={'Menu'}
        />
        <ReactTooltip delayShow={50} />
      </div>
    </div >
  );
}