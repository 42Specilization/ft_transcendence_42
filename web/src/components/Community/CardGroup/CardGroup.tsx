import { DotsThreeVertical, SignIn } from 'phosphor-react';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import './CardGroup.scss';

interface CardGroupProps{
  group: any
}


export function CardGroup(
  { group }: CardGroupProps
){

  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);

  console.log(group.name);
  return ( 
    <div  id='card__group' className='card__group'
    // onClick={(e) => selectActiveFriend(e)}
    >
      <div id='card__group' className='card__group__icon'
        style={{ backgroundImage: `url(${group.image_url})` }}>
        {/* <div id='card__group' className='card__group__status'
          style={{ backgroundColor: friend.status === 'online' ? 'green' : 'rgb(70, 70, 70)' }} /> */}
      </div>
      <div id='card__group' className='card__group__name'>{group.name}</div>

      <div className='card__group__menu'>
        <div id='card__group__menu__body' className='card__group__menu__body'
          style={{ height: isTableFriendUsersMenu ? '55px' : '0px', width: isTableFriendUsersMenu ? '80px' : '0px' }}>
          <button className='card__group__menu__button'
            onClick={() => console.log('chamou', group.name, 'pra um desafio')}
            data-html={true}
            data-tip={'Join Group'}>
            <SignIn size={32} />
          </button>
        </div>

        <DotsThreeVertical
          id='card__group__menu'
          className='chat__friends__header__icon'
          size={40}
          onClick={() => setIsTableFriendUsersMenu(prev=> !prev)}
          data-html={true}
          data-tip={'Menu'}
        />
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div>
    </div >
  );
}