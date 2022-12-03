import './CardChat.scss';
import { useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { ChatData } from '../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../others/utils/utils';

interface CardChatProps {
  chat: ChatData;
}

export function CardChat({ chat }: CardChatProps) {

  const { setSelectedChat, activeChat } = useContext(ChatContext);

  function newMessagesVisible() {
    if ((activeChat && activeChat.chat && activeChat.chat.id === chat.id)
      || (chat.newMessages === 0))
      return false;
    return true;
  }

  return (
    <div className='card__chat'
      onClick={() => setSelectedChat({ chat: chat.id, type: chat.type })}
    >
      <div className='card__chat__icon'
        style={{ backgroundImage: `url(${getUrlImage(chat.image as string)})` }}
      >
        <div className='card__chat_count'
          style={{ display: newMessagesVisible() ? '' : 'none' }}
        >
          {chat.newMessages > 9 ? '+9' : chat.newMessages}
        </div>
      </div>
      <div className='card__chat__name'>
        {chat.name}
      </div>
    </div>
  );
}