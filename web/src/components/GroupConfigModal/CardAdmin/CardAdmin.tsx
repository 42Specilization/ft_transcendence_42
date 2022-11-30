import './CardAdmin.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Alien, DotsThreeVertical, Prohibit, TelegramLogo, User, UserMinus } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsChat } from '../../../adapters/chat/chatState';

interface CardAdminProps {
  member: MemberData;
  id: string;
}

export function CardAdmin({ member, id }: CardAdminProps) {
  const [activeMenu, setActiveMenu] = useState(false);
  const { setSelectedChat } = useContext(ChatContext);
  const { api, config, intraData } = useContext(IntraDataContext);

  async function handleRemoveAdmin() {
    try {
      const response = await api.patch('/chat/removeAdmin', { name: member.name, groupId: id }, config);
      console.log(response);
      actionsChat.getUpdateGroup(id);
    } catch (err) {
      console.log(err);
    }
  }


  // async function handleMakeAdmin() {
  //   try {
  //     console.log(id);
  //     await api.patch('/chat/addAdmin', { name: member.name, groupId: id }, config);
  //     actionsChat.getUpdateGroup(id);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  function handleSendMessage() {
    setSelectedChat({ chat: member.name, type: 'person' });
  }

  async function handleRemoveFriend() {
    actionsChat.kickMember(id, intraData.email, member.name);
  }

  async function handleBanMember() {
    try {
      console.log(id);
      await api.patch('/chat/addBan', { name: member.name, groupId: id }, config);
      actionsChat.updateGroup();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='card__admin'
    //  onClick={() => setActiveMenu(prev => !prev)}
    >

      <div className="card__admin__div">
        <div
          className='card__admin__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div className='card__admin__name'>
          <span>{member.name}</span>
          <Alien size={32}/>
        </div>
      </div>

      <div className='card__friend__menu'>
        <div id='card__friend__menu__body' className='card__friend__menu__body'
          style={{ height: activeMenu ? '190px' : '0px', width: activeMenu ? '80px' : '0px' }}>
          <button className='card__friend__menu__button'
            onClick={handleRemoveAdmin}
            data-html={true}
            data-tip={'Remove Admin'}>
            <User size={32} />
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