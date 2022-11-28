import './Chat.scss';
import { useContext, useState, useEffect } from 'react';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { DirectTab } from '../../components/Chat/DirectTab/DirectTab';
import { GroupTab } from '../../components/Chat/GroupTab/GroupTab';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function Chat() {

  const { activeChat } = useContext(ChatContext);
  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);
  const [tableSelected, setTableSelected] = useState('Directs');

  function newMessages() {
    return intraData.directs.reduce((acc, direct) => {
      if (activeChat && direct.id === activeChat.chat.id)
        return acc;
      return acc + direct.newMessages;
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

  useEffect(() => {
    clearNotifyMessages();
  }, []);

  useEffect(() => {
    if (activeChat)
      clearNotifyMessages();
  }, [activeChat]);

  return (
    <div className='body'>
      <div className='chat'>
        <div className='chat__cards'>
          <nav className='chat__cards__header'>
            <ul className='chat__cards__header__list'>
              <li className={`chat__cards__header__list__item ${tableSelected === 'Directs' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <div onClick={() => setTableSelected('Directs')}>
                  <p>Directs</p>
                  {newMessages() > 0 &&
                    < div className='chat__cards__header__list__item__count' >
                      {newMessages()}
                    </div>
                  }
                </div>
              </li>
              <li className={`chat__cards__header__list__item ${tableSelected === 'Groups' ? 'chat__cards__header__list__item__selected' : ''}`}>
                <div onClick={() => setTableSelected('Groups')}>
                  <p>Groups</p>
                  {newMessages() > 0 &&
                    < div className='chat__cards__header__list__item__count' >
                      {newMessages()}
                    </div>
                  }
                </div>
              </li>
            </ul>
          </nav>
          <div className='chat__cards__body'>
            {(() => {
              if (tableSelected === 'Directs')
                return <DirectTab />;
              if (tableSelected === 'Groups')
                return <GroupTab />;
            })()}
          </div>
          <div className='chat__cards__footer' />
        </div>
        <ChatTalk setTableSelected={setTableSelected} />
      </div>
    </div >
  );
}
