import './CardOwner.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { Crown, DotsThreeVertical,  TelegramLogo } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../../contexts/ChatContext';

interface CardOwnerProps {
  member: MemberData;
  id: string;
}

export function CardOwner({ member}: CardOwnerProps) {
  const [activeMenu, setActiveMenu] = useState(false);
  const { setSelectedChat } = useContext(ChatContext);

  function handleSendMessage() {
    setSelectedChat({ chat: member.name, type: 'person' });
  }

  return (
    <div className='card__owner'
    //  onClick={() => setActiveMenu(prev => !prev)}
    >
      <div className="card__owner__div">
        <div
          className='card__owner__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div className='card__owner__name'>
          <span>{member.name}</span>
          <Crown size={32} />
        </div>
      </div>

      <div className='card__friend__menu'>
        <div id='card__friend__menu__body' className='card__friend__menu__body'
          style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
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