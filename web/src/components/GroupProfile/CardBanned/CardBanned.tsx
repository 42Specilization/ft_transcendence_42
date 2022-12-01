import './CardBanned.scss';
import { DotsThreeVertical, TelegramLogo, UserMinus } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { getUrlImage } from '../../../others/utils/utils';

interface CardBannedProps {
  id: string;
  banned: MemberData;
  setProfileGroupVisible: Dispatch<SetStateAction<boolean>>;
}

export function CardBanned({ id, banned, setProfileGroupVisible }: CardBannedProps) {

  const { intraData } = useContext(IntraDataContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);

  function handleSendMessage() {
    setSelectedChat({ chat: banned.name, type: 'person' });
    setProfileGroupVisible(false);
  }

  async function handleRemoveBan() {
    try {
      actionsChat.removeBanMember(id, intraData.email, banned.name);
    } catch (err) {
      console.log(err);
    }
  }

  function modalVisible(event: any) {
    if (event.target.id === 'card__banned')
      setFriendProfileVisible(true);
  }

  return (
    <div id='card__banned' className='card__banned' onClick={modalVisible}>
      <div id='card__banned' className="card__banned__div">
        <div id='card__banned'
          className='card__banned__icon'
          style={{ backgroundImage: `url(${getUrlImage(banned.image)})` }}>
        </div>
        <div id='card__banned' className='card__banned__name'>{banned.name}</div>
      </div>

      <div className="card__banned__menu">
        <div
          className="card__banned__menu__body"
          style={{ height: activeMenu ? '100px' : '0px', width: activeMenu ? '90px' : '0px' }}
        >
          <Link to='/chat'>
            <button className='card__friend__menu__button'
              onClick={handleSendMessage}
              data-html={true}
              data-tip={'Send Message'}
            >
              <TelegramLogo size={32} />
            </button>
          </Link>
          <button
            className='card__banned__menu__button'
            onClick={handleRemoveBan}
            data-html={true}
            data-tip={'Unblock'}
          >
            <UserMinus size={32} />
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
      </div>
      <ReactTooltip delayShow={50} />
      {
        friendProfileVisible &&
        <ProfileFriendModal
          login={banned.name}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
    </div>
  );
}
