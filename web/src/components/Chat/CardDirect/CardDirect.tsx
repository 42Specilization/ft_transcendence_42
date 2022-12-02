import './CardDirect.scss';
import { useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../others/utils/utils';

interface CardDirectProps {
  chat: DirectData;
}

export function CardDirect({ chat }: CardDirectProps) {
  const { setSelectedChat, activeChat } = useContext(ChatContext);

  function setChat(chat: DirectData) {
    setSelectedChat({ chat: chat.id, type: 'direct' });
  }

  function newMessagesVisible() {
    if ((activeChat && activeChat.chat && activeChat.chat.id === chat.id)
      || (chat.newMessages === 0))
      return false;
    return true;
  }
  
  function selectChat(e: any) {
    if (e.target.id === 'card__direct')
      setChat(chat);
  }

  return (
    <div
      id='card__direct'
      className='card__direct'
      onClick={(e) => selectChat(e)}
    >
      <div
        className='card__direct__icon'
        id='card__direct'
        style={{ backgroundImage: `url(${getUrlImage(chat.image as string)})` }}>
        <div className='card__direct_count'
          style={{ display: newMessagesVisible() ? '' : 'none' }}>
          {chat.newMessages > 9 ? '+9' : chat.newMessages}
        </div>
      </div>
      <div
        id='card__direct'
        className='card__direct__name'>
        {chat.name}
      </div>
    </div>
  );
}