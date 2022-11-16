import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../Interfaces/interfaces';
import './CardDirect.scss';

interface CardDirectProps {
  chat: DirectData;
  setActiveChat: Dispatch<SetStateAction<DirectData | null>>;
}

export function CardDirect({ chat, setActiveChat }: CardDirectProps) {
  const { api, config } = useContext(IntraDataContext);

  // const data ={}
  // api.post('/chat/createDirect', ,)

  return (
    <div className='card__direct' onClick={() => setActiveChat(chat)}>
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