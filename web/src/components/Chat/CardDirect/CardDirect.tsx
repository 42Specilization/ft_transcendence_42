import { useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import './CardDirect.scss';

interface CardDirectProps {
  chat: DirectData;

}

export function CardDirect({ chat }: CardDirectProps) {
  const { setDirectsChat, activeChat } = useContext(ChatContext);

  function setChat(chat: DirectData) {
    setDirectsChat(chat.id);
  }

  function newMessagesVisible() {
    if ((activeChat && activeChat.chat && activeChat.chat.id === chat.id)
      || (chat.newMessages === 0))
      return false;
    return true;
  }

  return (
    <div className='card__direct' onClick={() => setChat(chat)}>
      <div className="card__direct__div">
        <div
          className='card__direct__icon'
          style={{ backgroundImage: `url(${chat.image})` }}>
          <div className='card__direct_count'
            style={{ display: newMessagesVisible() ? '' : 'none' }}>
            {chat.newMessages > 9 ? '+9' : chat.newMessages}
          </div>
        </div>
        <div className='card__direct__name'>{chat.name}</div>
      </div>
    </div>
  );
}