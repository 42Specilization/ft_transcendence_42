import './Chat.scss';
import { useContext, useEffect } from 'react';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { DirectTab } from '../../components/Chat/DirectTab/DirectTab';
import { GroupTab } from '../../components/Chat/GroupTab/GroupTab';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function Chat() {

  const { activeChat, tabSelected, setTabSelected } = useContext(ChatContext);
  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);

  useEffect(() => {
    clearNotifyMessages();
  }, []);

  useEffect(() => {
    if (activeChat)
      clearNotifyMessages();
  }, [activeChat]);

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

  async function removeNotify(notify: any) {
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
  }

  async function clearNotifyMessages() {
    intraData.notify.forEach(async (notify) => {
      if (notify.type === 'message') {
        await api.patch('/user/removeNotify', { id: notify.id }, config);
        removeNotify(notify);
      }
    });
  }


  return (
    <div className='body'>
      <div className='chat'>
        <div className='chat__cards'>
          <nav className='chat__cards__header'>
            <ul className='chat__cards__header__list'>
              <li className={`chat__cards__header__list__item ${tabSelected === 'directs' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <div onClick={() => setTabSelected('directs')}>
                  <p>Directs</p>
                  {newMessages('direct') > 0 &&
                    < div className='chat__cards__header__list__item__count' >
                      {newMessages('direct')}
                    </div>
                  }
                </div>
              </li>
              <li className={`chat__cards__header__list__item ${tabSelected === 'groups' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <div onClick={() => setTabSelected('groups')}>
                  <p>Groups</p>
                  {newMessages('group') > 0 &&
                    < div className='chat__cards__header__list__item__count' >
                      {newMessages('group')}
                    </div>
                  }
                </div>
              </li>
            </ul>
          </nav>
          <div className='chat__cards__body'>
            {(() => {
              if (tabSelected === 'directs')
                return <DirectTab />;
              if (tabSelected === 'groups')
                return <GroupTab />;
            })()}
          </div>
          <div className='chat__cards__footer' />
        </div>
        <ChatTalk />
      </div>
    </div >
  );
}
