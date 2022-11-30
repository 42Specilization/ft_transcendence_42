import './CardGroup.scss';
import { DotsThreeVertical, LockKey, Shield, SignIn, SignOut, TelegramLogo } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { GroupCardData } from '../../../others/Interfaces/interfaces';
import { Link } from 'react-router-dom';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsChat } from '../../../adapters/chat/chatState';

interface CardGroupProps {
  group: GroupCardData;
}

export function CardGroup({ group }: CardGroupProps) {

  const { intraData } = useContext(IntraDataContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);

  function handleSendMessage(e: any) {
    if (e.target.id === 'card__group__community')
      setSelectedChat({
        chat: group.id,
        type: 'group'
      });
  }

  function handleJoinGroup() {
    actionsChat.joinGroup(group.id, intraData.email);
  }

  function handleLeaveGroup() {
    actionsChat.leaveGroup(group.id, intraData.email);
  }

  return (
    <div id='card__group__community' className='card__group__community'
      onClick={() => console.log('clicou no bagulho')}
    >
      <div id='card__group__community' className='card__group__community__icon'
        style={{ backgroundImage: `url(${group.image})` }}>
      </  div>
      <div id='card__group__community' className='card__group__community__name'>{group.name}</div>

      <div className='card__group__community__menu__div'>
        <div
          style={{ paddingRight: '20px' }}
        >
          {(() => {
            if (group.type === 'private') {
              return <LockKey size={32}
                data-html={true}
                data-tip={'Private Group'} />;
            }
            else if (group.type === 'protected')
              return <Shield size={32}
                data-html={true}
                data-tip={'Protected Group'} />;
          })()}
        </  div>

        <div className='card__group__community__menu'>
          {group.member ?
            <div id='card__group__community__menu__body' className='card__group__community__menu__body'
              style={{ height: activeMenu ? '100px' : '0px', width: activeMenu ? '80px' : '0px' }}>
              <Link to='/chat'>
                <button className='card__group__community__menu__button'
                  onClick={handleSendMessage}
                  data-html={true}
                  data-tip={'Send Message'}
                >
                  <TelegramLogo size={32} />
                </  button>
              </  Link>
              <button className='card__group__community__menu__button'
                onClick={handleLeaveGroup}
                data-html={true}
                data-tip={'Leave Group'}
              >
                <SignOut size={32} />
              </  button>
            </  div>
            :
            <div id='card__group__community__menu__body' className='card__group__community__menu__body'
              style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
              <button className='card__group__community__menu__button'
                onClick={handleJoinGroup}
                data-html={true}
                data-tip={'Join Group'}
              >
                <SignIn size={32} />
              </  button>
            </  div>
          }
          <DotsThreeVertical
            id='card__group__community__menu'
            className='card__group__community__header__icon'
            size={40}
            onClick={() => setActiveMenu(prev => !prev)}
            data-html={true}
            data-tip={'Menu'}
          />
        </  div>
        <ReactTooltip delayShow={50} />
      </  div>
    </  div >
  );
}