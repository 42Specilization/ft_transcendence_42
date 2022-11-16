import './ChatCommunity.scss';
import { DirectData } from '../../../Interfaces/interfaces';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { FriendTab } from '../FriendsTab/FriendsTab';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectTab } from '../DirectTab/DirectTab';

interface ChatCommunityProps {
  setActiveChat: Dispatch<SetStateAction<DirectData | null>>;
}

export function ChatCommunity({ setActiveChat }: ChatCommunityProps) {

  const [tableSelected, setTableSelected] = useState('Friends');
  const { intraData } = useContext(IntraDataContext);

  useEffect(() => {
    console.log(intraData);
  }, []);

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
            return <FriendTab setActiveChat={setActiveChat} />;
          else if (tableSelected === 'Directs')
            return <DirectTab setActiveChat={setActiveChat} />;
          else
            return <></>;
        })()}
      </div>
      <div className='chat__community__footer' />
    </div>
  );
}
