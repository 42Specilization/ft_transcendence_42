import './Chat.scss';
import { useContext, useState } from 'react';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { DirectTab } from '../../components/Chat/DirectTab/DirectTab';
import { GroupTab } from '../../components/Chat/GroupTab/GroupTab';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function Chat() {

  const { activeChat } = useContext(ChatContext);
  const { intraData } = useContext(IntraDataContext);
  const [tableSelected, setTableSelected] = useState('Directs');

  function newMessages() {
    return intraData.directs.reduce((acc, direct) => {
      if (activeChat && direct.id === activeChat.chat.id)
        return acc;
      return acc + direct.newMessages;
    }, 0);
  }

  // Criar metodo para apagar as notificações de mensagens se entrar no chat por conta propria
  

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
        <ChatTalk />
      </div>
    </div >
  );
}
