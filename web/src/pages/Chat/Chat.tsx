import './Chat.scss';
import { useContext } from 'react';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ChatContext } from '../../contexts/ChatContext';
import { ChatTab } from '../../components/Chat/ChatTab/ChatTab';

export default function Chat() {

  const { activeChat, tabSelected, setTabSelected } = useContext(ChatContext);
  const { intraData } = useContext(IntraDataContext);

  function newMessages(type: string) {
    const chat = type === 'direct' ? intraData.directs : intraData.groups;
    if (typeof chat === 'undefined' || chat.length === 0)
      return 0;
    return chat.reduce((acc, chat) => {
      if (activeChat && chat.id === activeChat.chat.id)
        return acc;
      return acc + chat.newMessages;
    }, 0);
  }

  return (
    <div className='body'>
      <div className='chat'>
        <div className='chat__cards'>
          <nav className='chat__cards__header'>
            <ul className='chat__cards__header__list'>
              <li className={`chat__cards__header__list__item ${tabSelected === 'Direct' ? 'chat__cards__header__selected' : ''}`}>
                <div onClick={() => setTabSelected('Direct')}>
                  <p>Directs</p>
                  {newMessages('direct') > 0 &&
                    < div className='chat__cards__header__count' >
                      {newMessages('direct')}
                    </div>
                  }
                </div>
              </li>
              <li className={`chat__cards__header__list__item ${tabSelected === 'Group' ? 'chat__cards__header__selected' : ''}`}>
                <div onClick={() => setTabSelected('Group')}>
                  <p>Groups</p>
                  {newMessages('group') > 0 &&
                    < div className='chat__cards__header__count' >
                      {newMessages('group')}
                    </div>
                  }
                </div>
              </li>
            </ul>
          </nav>
          <div className='chat__cards__body'>
            <ChatTab tabSelected={tabSelected} />
          </div>
          <div className='chat__cards__footer' />
        </div>
        <ChatTalk />
      </div>
    </div >
  );
}
