import './CardNotify.scss';
import { Children, useState } from 'react';
import { NotifyData } from '../../../others/Interfaces/interfaces';

interface CardNotifyProps {
  notify: NotifyData;
  message: string;
  children: any | any[];
}

export function CardNotify({ notify, message, children }: CardNotifyProps) {

  const [side, setSide] = useState(true);

  function changeSide(event: any) {
    if (event.target.id === 'front_side' || event.target.id === 'back_side') {
      setSide(prevSide => !prevSide);
    }
  }

  return (
    <div className='card__notify__content'>
      <div id={'front_side'} className='card__notify__frontSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '100%' : '0px') }}>
        <strong id={'front_side'} className='card__notify__frontSide__nick'>
          {notify.user_source}
        </strong>
        <strong id={'front_side'} className='card__notify__frontSide__text'>
          {message}
        </strong>
      </div >
      <div id={'back_side'} className='card__notify__backSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '0px' : '100%') }}
      >
        {Children.map(children, child => <div>{child}</div>)}
      </div >
    </div>
  );
}
