import './CardMember.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { CrownSimple, DotsThreeVertical, Prohibit, Sword, TelegramLogo, UserMinus, Alien } from 'phosphor-react';
import { ChatContext } from '../../../contexts/ChatContext';
import { Link } from 'react-router-dom';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { actionsChat } from '../../../adapters/chat/chatState';

interface CardMemberProps {
  id: string;
  member: MemberData
}

export function CardMember({ member, id }: CardMemberProps) {

  const [activeMenu, setActiveMenu] = useState(false);
  const { setSelectedChat } = useContext(ChatContext);
  const { api, config, intraData } = useContext(IntraDataContext);

  async function handleMakeAdmin() {
    try {
      console.log(id);
      await api.patch('/chat/addAdmin', { name: member.name, groupId: id }, config);
      actionsChat.getUpdateGroup(id);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSendMessage() {
    setSelectedChat({ chat: member.name, type: 'person' });
  }

  async function handleRemoveFriend() {
    actionsChat.kickMember(id, intraData.email, member.name);
  }

  async function handleBanMember() {
    // await api.patch('/user/addBlocked', { nick: friend.login }, config);
    // await api.patch('/chat/deleteDirect', { friend_login: friend.login }, config);

    // setIntraData((prevIntraData) => {
    //   prevIntraData.blockeds.push(friend);
    //   return {
    //     ...prevIntraData,
    //     directs: prevIntraData.directs.filter((key) => key.name != friend.login),
    //     friends: prevIntraData.friends.filter((key) => key.login != friend.login),
    //   };
    // });
    // actionsStatus.blockFriend(friend.login);
  }

  return (
    <div className='card__member'
    //  onClick={() => setActiveMenu(prev => !prev)}
    >

      <div className="card__member__div">
        <div
          className='card__member__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div className='card__member__name'>{member.name}</div>
      </div>

      <div className='card__friend__menu'>
        <div id='card__friend__menu__body' className='card__friend__menu__body'
          style={{ height: activeMenu ? '190px' : '0px', width: activeMenu ? '80px' : '0px' }}>


          <button className='card__friend__menu__button'
            onClick={handleMakeAdmin}
            data-html={true}
            data-tip={'Make Admin'}>
            <Alien size={32} />
          </button>

          {/* Usuario nao pode se redirecionar pro proprio chat */}
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
            className='card__friend__menu__button'
            onClick={handleRemoveFriend}
            data-html={true}
            data-tip={'Remove Member'}
          >
            <UserMinus size={32} />
          </button>
          <button className='card__friend__menu__button'
            onClick={handleBanMember}
            data-html={true}
            data-tip={'Ban Member'}
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
      </div>
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
    </div>
  );
}