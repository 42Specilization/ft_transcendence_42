import './UserCardFriend.scss';
import { FriendData } from '../../../Interfaces/interfaces';
import { Dispatch, SetStateAction, useState } from 'react';
import { DotsThreeVertical, Prohibit, Sword, UserMinus } from 'phosphor-react';
import ReactTooltip from 'react-tooltip';

interface UserCardFriendProps {
  friend: FriendData;
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export function UserCardFriend({ friend, setActiveFriend }: UserCardFriendProps) {
  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);

  function selectActiveFriend(e: any) {
    if (e.target.id !== 'user__card__friend__menu') {
      setActiveFriend(friend);
    }
  }

  async function handleRemoveFriend() {

  }


  return (
    <div className='user__card__friend'
      onClick={(e) => selectActiveFriend(e)}
    >
      <div className='user__card__friend__div'>
        <div
          className='user__card__friend__icon'
          style={{ backgroundImage: `url(${friend.image_url})` }}
        >
          <div className='user__card__friend__status'
            style={{ backgroundColor: friend.status === 'online' ? 'green' : 'rgb(70, 70, 70)' }}>
          </div>
        </div>
        <div className='user__card__friend__name'>{friend.login}</div>
      </div>

      <div id='user__card__friend__menu' className='user__card__friend__menu'>



        <div className='user__card__friend__menu__body'
          style={{ height: isTableFriendUsersMenu ? '145px' : '0px', width: isTableFriendUsersMenu ? '90px' : '0px' }}>
          <button className='user__card__friend__menu__button'
            onClick={() => { }}
            data-html={true}
            data-tip={'Challenge'}>
            <Sword size={32} />
          </button>
          <button
            className='user__card__friend__menu__button'
            onClick={handleRemoveFriend}
            data-html={true}
            data-tip={'Remove Friend'}
          >
            <UserMinus size={32} />
          </button>
          <button className='user__card__friend__menu__button'
            onClick={() => { }}
            data-html={true}
            data-tip={'Block'}
          >
            <Prohibit size={32} />
          </button>
        </div>

        <DotsThreeVertical
          id='user__card__friend__menu'
          className='chat__friends__header__icon'
          size={40}
          onClick={() => setIsTableFriendUsersMenu(prev => !prev)}
          data-html={true}
          data-tip={'Menu'}
        />

        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div>
    </div >
  );
}
