import { DotsThreeVertical, Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ChatContext } from '../../../contexts/ChatContext';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import './CardDirect.scss';

interface CardDirectProps {
  chat: DirectData;
}

export function CardDirect({ chat }: CardDirectProps) {
  const { setSelectedChat, activeChat } = useContext(ChatContext);
  const {api, config, setIntraData } = useContext(IntraDataContext);
  const [activeMenu, setActiveMenu] = useState(false);
  function setChat(chat: DirectData) {
    setSelectedChat({ chat: chat.id, type: 'direct' });
  }

  function newMessagesVisible() {
    if ((activeChat && activeChat.chat && activeChat.chat.id === chat.id)
      || (chat.newMessages === 0))
      return false;
    return true;
  }

  async function handleBlockFriend() {
    await api.patch('/user/addBlocked', { nick: chat.name }, config);
    await api.patch('/chat/deleteDirect', { friend_login: chat.name }, config);
        
    setIntraData((prevIntraData) => {
      if(chat.name && chat.image)
        prevIntraData.blocked.push({ login: chat.name, image_url: chat.image});
      return {
        ...prevIntraData,
        directs: prevIntraData.directs.filter((key) => key.name != chat.name),
        friends: prevIntraData.friends.filter((key) => key.login != chat.name),
      };
    });
    if(chat.name)
      actionsStatus.blockFriend(chat.name);
  }

  function selectChat(e: any){
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
        style={{ backgroundImage: `url(${chat.image})` }}>
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
      <div className='card__friend__menu'>
        <div 
          id='card__friend__menu__body'
          className='card__friend__menu__body'
          style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
          <button
            className='card__friend__menu__button'
            onClick={handleBlockFriend}
            data-html={true}
            data-tip={'Block'}
          >
            <Prohibit size={32} />
          </button>
        </div>

        <DotsThreeVertical
          id='card__friend__menu'
          className='chat__friends__header__icon'
          size={40}
          onClick={() => setActiveMenu(prev => !prev)}
          data-html={true}
          data-tip={'Menu'}
        />
        <ReactTooltip delayShow={50} />
      </div>
    </div>
  );
}