import './Chat.scss';
import { useState } from 'react';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { FriendTab } from '../../components/Chat/FriendTab/FriendTab';
import { DirectTab } from '../../components/Chat/DirectTab/DirectTab';
import { GroupTab } from '../../components/Chat/GroupTab/GroupTab';

export default function Chat() {

  const [tableSelected, setTableSelected] = useState('Friends');

  return (
    <div className='body'>
      <div className='chat'>
        <div className='chat__cards'>
          <nav className='chat__cards__header'>
            <ul className='chat__cards__header__list'>
              <li className={`chat__cards__header__list__item ${tableSelected === 'Friends' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <button onClick={() => setTableSelected('Friends')}>
                  Friends
                </button>
              </li>
              <li className={`chat__cards__header__list__item ${tableSelected === 'Directs' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <button onClick={() => setTableSelected('Directs')}>
                  Directs
                </button>
              </li>
              <li className={`chat__cards__header__list__item ${tableSelected === 'Groups' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <button onClick={() => setTableSelected('Groups')}>
                  Groups
                </button>
              </li>
            </ul>
          </nav>
          <div className='chat__cards__body'>
            {(() => {
              if (tableSelected === 'Friends')
                return <FriendTab setTableSelected={setTableSelected} />;
              else if (tableSelected === 'Directs')
                return <DirectTab />;
              else
                return <GroupTab />;
            })()}
          </div>
          <div className='chat__cards__footer' />
        </div>
        <ChatTalk />
      </div>
    </div>
  );
}
