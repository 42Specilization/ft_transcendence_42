import './CardAdmin.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { Alien, DotsThreeVertical, Link, TelegramLogo } from 'phosphor-react';
import { useContext, useState } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';

interface CardAdminProps {
  member: MemberData
}

export function CardAdmin({ member }: CardAdminProps) {

  const [profileMemberVisible, setProfileMemberVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const { setSelectedChat } = useContext(ChatContext);
  const { intraData } = useContext(IntraDataContext);

  function handleSendMessage() {
    setSelectedChat({ chat: member.name, type: 'person' });
  }

  function selectProfileMemberVisible(e: any) {
    if (e.target.id === 'card__member')
      setProfileMemberVisible((prev) => !prev);
  }

  return (
    <div id='card__member' className='card__member'
      onClick={(e) => selectProfileMemberVisible(e)}
    >

      <div id='card__member' className="card__member__div">
        <div
          id='card__member'
          className='card__member__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div id='card__member' className='card__member__name'>{member.name}</div>
      </div>
      <div className='card__group__community__menu__div'>
        <div
          style={{ paddingRight: '20px' }}
        >
          <Alien size={32}
            data-html={true}
            data-tip={'Protected Group'} />;
        </  div>
        <div className='card__friend__menu'
          style={{ display: intraData.login === member.name ? 'none' : '' }}>
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
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
        {
          profileMemberVisible &&
          <ProfileFriendModal login={member.name} setFriendProfileVisible={setProfileMemberVisible} />
        }
      </div>
    </div>
  );
}
