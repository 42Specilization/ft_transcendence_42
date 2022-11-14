import './Notifications.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NotificationChallenge } from './NotificationChallenge/NotificationChallenge';
import { NotificationFriend } from './NotificationFriend/NotificationFriend';
import { NotificationMessage } from './NotificationMessage/NotificationMessage';
// import axios from 'axios';
import { IntraData } from '../../Interfaces/interfaces';


interface NotificationProps {
 intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function Notifications({ intraData, setIntraData }: NotificationProps) {

  return (
    <div className='notification__body'>
      {intraData.notify.length > 0 ?
        intraData.notify.map((obj) =>
          <div key={obj.id}
            className={'notification__body__content'}>
            {(() => {
              if (obj.type === 'friend')
                return <NotificationFriend notify={obj} />;
              // if (obj.type === 'message')
              //   return <NotificationMessage notify={obj} />;
              // if (obj.type === 'challenge')
              //   return <NotificationChallenge notify={obj} />;
            })()}
          </div>
        )
        :
        <p className='notify__content__empty'>empty</p>
      }
    </div>
  );
}
