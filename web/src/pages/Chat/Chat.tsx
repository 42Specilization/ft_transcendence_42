import './Chat.scss';
import { useContext, useState } from 'react';
// import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { FriendTab } from '../../components/Chat/FriendsTab/FriendsTab';
import { DirectTab } from '../../components/Chat/DirectTab/DirectTab';

export default function Chat() {

  const [tableSelected, setTableSelected] = useState('Friends');

  return (
    <div className='body'>
      <div className='chat'>
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
                return <FriendTab setTableSelected={setTableSelected} />;
              else if (tableSelected === 'Directs')
                return <DirectTab />;
              else
                return <></>;
            })()}
          </div>
          <div className='chat__community__footer' />
        </div>
        <ChatTalk />
      </div>
    </div>
  );
}
