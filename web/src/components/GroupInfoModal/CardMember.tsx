import './CardMember.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../others/Interfaces/interfaces';
import { useState } from 'react';

interface CardMemberProps {
  member: MemberData
}

export function CardMember({ member }: CardMemberProps) {

  const [activeMenu, setActiveMenu] = useState(false);



  return (
    <div className='card__member'
    //  onClick={() => setActiveMenu(prev => !prev)}
    >

      <div className="card__member__div">
        <div
          className='card__member__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div className='card__member__name'>{member.name}</div>
      </div>

      {/* <div className="card__member__menu">
        <div
          className="card__member__menu__body"
          style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '90px' : '0px' }}
        >
          <button
            className='card__member__menu__button'
            onClick={() => console.log('clicou')}
            data-html={true}
            data-tip={'Unblock'}
          >
            <UserMinus size={32} />
          </button>
        </div>
      </div> */}
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
    </div>
  );
}