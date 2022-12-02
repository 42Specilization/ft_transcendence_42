import './CardAdmin.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Alien, DotsThreeVertical, Prohibit, SpeakerHigh, SpeakerSlash, TelegramLogo, User, UserMinus } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsChat } from '../../../adapters/chat/chatState';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ConfirmActionModal } from '../../ConfirmActionModal/ConfirmActionModal';

interface CardAdminProps {
  id: string;
  member: MemberData;
  getPermission: (arg0: string) => boolean;
}

export function CardAdmin({ id, member, getPermission }: CardAdminProps) {
  const { api, config, intraData } = useContext(IntraDataContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [confirmActionVisible, setConfirmActionVisible] = useState('');

  function heightMenu() {
    if (getPermission('maxLevel'))
      return '235px';
    return '55px';
  }

  async function handleRemoveAdmin() {
    try {
      await api.patch('/chat/removeAdmin', { name: member.name, groupId: id }, config);
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
    try {
      actionsChat.banMember(id, intraData.email, member.name);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMute() {
    try {
      await api.patch('/chat/muteMember', { name: member.name, groupId: id }, config);
      actionsChat.getUpdateGroup(id);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUnmute() {
    try {
      await api.patch('/chat/removeMuteMember', { name: member.name, groupId: id }, config);
      actionsChat.getUpdateGroup(id);
    } catch (err) {
      console.log(err);
    }
  }

  function modalVisible(event: any) {
    if (event.target.id === 'card__admin')
      setFriendProfileVisible(true);
  }

  return (
    <div id='card__admin' className='card__admin' onClick={modalVisible}>
      <div id='card__admin' className="card__admin__div">
        <div id='card__admin'
          className='card__admin__icon'
          style={{ backgroundImage: `url(${getUrlImage(member.image)})` }}>
        </div>
        <div id='card__admin' className='card__admin__name'>
          <span id='card__admin'>{member.name}</span>
          <Alien id='card__admin' size={32} />
        </div>
      </div>

      {intraData.login !== member.name &&
        <div className='card__friend__menu'>
          <div id='card__friend__menu__body' className='card__friend__menu__body'
            style={{ height: activeMenu ? heightMenu() : '0px', width: activeMenu ? '80px' : '0px' }}>

            <Link to='/chat'>
              <button className='card__friend__menu__button'
                onClick={handleSendMessage}
                data-html={true}
                data-tip={'Send Message'}
              >
                <TelegramLogo size={32} />
              </button>
            </Link>

            {getPermission('maxLevel') &&
              <>
                <button className='card__friend__menu__button'
                  onClick={()=> setConfirmActionVisible('removeAdmin')}
                  data-html={true}
                  data-tip={'Remove Admin'}>
                  <User size={32} />
                </button>
                {member.mutated ?
                  <button
                    className='card__friend__menu__button'
                    onClick={()=> setConfirmActionVisible('unmute')}
                    data-html={true}
                    data-tip={'Unmute Member'}
                  >
                    <SpeakerHigh size={32} />
                  </button>
                  :
                  <button
                    className='card__friend__menu__button'
                    onClick={()=> setConfirmActionVisible('mute')}
                    data-html={true}
                    data-tip={'Mute Member(15 minutes)'}
                  >
                    <SpeakerSlash size={32} />
                  </button>
                }
                <button
                  className='card__friend__menu__button'
                  onClick={()=> setConfirmActionVisible('removeMember')}
                  data-html={true}
                  data-tip={'Remove Member'}
                >
                  <UserMinus size={32} />
                </button>
                <button className='card__friend__menu__button'
                  onClick={()=> setConfirmActionVisible('ban')}
                  data-html={true}
                  data-tip={'Ban Member'}
                >
                  <Prohibit size={32} />
                </button>
              </>
            }
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
      {friendProfileVisible &&
        <ProfileFriendModal
          login={member.name}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
           
      {(() => {
        if (confirmActionVisible === 'removeAdmin'){
          return <ConfirmActionModal
            title={`Remove admin ${member.name}?`}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleRemoveAdmin}
          />;
        }
        if (confirmActionVisible === 'mute'){
          return <ConfirmActionModal
            title={`Mute ${member.name}?`}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleMute}
          />;
        }
        if (confirmActionVisible === 'unmute'){
          return <ConfirmActionModal
            title={`Unmute ${member.name}?`}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleUnmute}
          />;
        }
        if (confirmActionVisible === 'removeMember'){
          return <ConfirmActionModal
            title={`Remove ${member.name}?`}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleRemoveFriend}
          />;
        }
        if (confirmActionVisible === 'ban'){
          return <ConfirmActionModal
            title={`Ban ${member.name}?`}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleBanMember}
          />;
        }
      })()}
    </div>
  );
}