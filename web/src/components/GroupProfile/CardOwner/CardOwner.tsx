import './CardOwner.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { Crown, DotsThreeVertical, TelegramLogo } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../../contexts/ChatContext';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';

interface CardOwnerProps {
  member: MemberData;
}

export function CardOwner({ member }: CardOwnerProps) {

  const { intraData } = useContext(IntraDataContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);

  function handleSendMessage() {
    setSelectedChat({ chat: member.name, type: 'person' });
  }

  function modalVisible(event: any) {
    if (event.target.id === 'card__owner')
      setFriendProfileVisible(true);
  }

  return (
    <div id='card__owner' className='card__owner' onClick={modalVisible}>
      <div id='card__owner' className="card__owner__div">
        <div id='card__owner'
          className='card__owner__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div id='card__owner' className='card__owner__name'>
          <span id='card__owner'>{member.name}</span>
          <Crown id='card__owner' size={32} />
        </div>
      </div>

      {
        intraData.login !== member.name &&
        < div className='card__friend__menu'>
          <div id='card__friend__menu__body' className='card__friend__menu__body'
            style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
            <Link to='/chat'>
              <button className='card__friend__menu__button'
                onClick={handleSendMessage}
                data-html={true}
                data-tip={'Send Message'}
              >
                <TelegramLogo size={32} />
              </button>
            </Link>
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
      }
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      {
        friendProfileVisible &&
        <ProfileFriendModal
          login={member.name}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
    </div >
  );
}