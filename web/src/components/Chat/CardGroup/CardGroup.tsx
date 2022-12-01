import { useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../others/utils/utils';
import './CardGroup.scss';

interface CardGroupProps {
  chat: DirectData;

}

export function CardGroup({ chat }: CardGroupProps) {
  const { setSelectedChat, activeChat } = useContext(ChatContext);

  function setChat(chat: DirectData) {
    setSelectedChat({ chat: chat.id, type: 'group' });
  }

  function newMessagesVisible() {
    if ((activeChat && activeChat.chat && activeChat.chat.id === chat.id)
      || (chat.newMessages === 0))
      return false;
    return true;
  }

  return (
    <div className='card__group' onClick={() => setChat(chat)}>
      <div className="card__group__div">
        <div
          className='card__group__icon'
          style={{ backgroundImage: `url(${getUrlImage(chat.image as string)})` }}>
          <div className='card__group_count'
            style={{ display: newMessagesVisible() ? '' : 'none' }}>
            {chat.newMessages > 9 ? '+9' : chat.newMessages}
          </div>
        </div>
        <div className='card__group__name'>{chat.name}</div>
      </div>
    </div>
  );
}