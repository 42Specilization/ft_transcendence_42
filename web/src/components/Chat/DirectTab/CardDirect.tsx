import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../Interfaces/interfaces';
import './CardDirect.scss';

interface CardDirectProps {
  chat: DirectData;

}

export function CardDirect({ chat }: CardDirectProps) {
  const { api, config } = useContext(IntraDataContext);

  const { setDirectsChat } = useContext(ChatContext);

  function setChat(chat: DirectData) {
    setDirectsChat(chat.id);
  }

  return (
    <div className='card__direct' onClick={() => setChat(chat)}>
      <div className="card__direct__div">
        <div
          className='card__direct__icon'
          style={{ backgroundImage: `url(${chat.image})` }}>
        </div>
        <div className='card__direct__name'>{chat.name}</div>
      </div>
      {/*
      <div className="card__blocked__menu">
        <div
          className="card__blocked__menu__body"
        >
          <button
            className='card__blocked__menu__button'
            onClick={handleUnblock}
            data-html={true}
            data-tip={'Unblock'}
          >
            <UserMinus size={32} />
          </button>
        </div>
      </div>
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} /> */}
    </div>
  );
}