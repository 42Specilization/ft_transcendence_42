import './ChatCommunity.scss';
import { FriendData } from '../../../Interfaces/interfaces';
import { Dispatch, SetStateAction, useState } from 'react';
import ChatFriends from './ChatFriends';

interface ChatCommunityProps {
  friends: FriendData[];
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export function ChatCommunity({
  friends,
  setActiveFriend,
}: ChatCommunityProps) {

  const [tableSelected, setTableSelected] = useState('Friends');

  return (
    <div className='chat__community'>
      <nav className='chat__community__header'>
        <ul className='chat__community__header__list'>
          <li className={`chat__community__header__list__item ${tableSelected === 'Friends' ? 'chat__community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Friends')}>
              Friends
            </button>
          </li>
          <li className={`chat__community__header__list__item ${tableSelected === 'Directs' ? 'chat__community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Directs')}>
              Directs
            </button>
          </li>
          <li className={`chat__community__header__list__item ${tableSelected === 'Groups' ? 'chat__community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Groups')}>
              Groups
            </button>
          </li>
        </ul>
      </nav>
      <div className='chat__community__body'>
        {(() => {
          if (tableSelected === 'Friends')
            return <ChatFriends friends={friends} setActiveFriend={setActiveFriend} />;
          else if (tableSelected === 'Directs')
            return <> </>;
          else
            return <></>;
        })()}
      </div>
      <div className='chat__community__footer' />
    </div>
  );
}
