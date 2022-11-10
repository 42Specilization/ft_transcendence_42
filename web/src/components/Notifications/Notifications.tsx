import './Notifications.scss';
import { Bell } from 'phosphor-react';
import { useState } from 'react';
import { NotificationChallenge } from './NotificationChallenge/NotificationChallenge';
import { NotificationFriend } from './NotificationFriend/NotificationFriend';
import { NotificationMessage } from './NotificationMessage/NotificationMessage';

export function Notifications(){
  const [notificationVisible, setNotificationVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOutsideClick (e: any, id : string)  {
    console.log('aqui');
    if (e.target.id == id) {
      setNotificationVisible(false);
    }
  }

  return (
    <div
      className='notifications__div__menu'
      onClick={() =>  setNotificationVisible(!notificationVisible)}
    > 
      <Bell className='notify__icon' size={40} />
      <nav
        className='notifications__menu'
        style={{top: (notificationVisible ? '100px' : '-800px')}}
      >
        {
          notificationVisible ?
            <>
              <div
                id='notifications__overlay'
                className='notifications__overlay'
                onClick={(e)=> handleOutsideClick(e, 'notifications__overlay')}>
              </div>
            </> 
            : null
        }
        <div
          id='notifications'
          className='notifications'
        >
          <div className="notification__body">
            <NotificationFriend />
            <NotificationFriend />
            <NotificationFriend />
            <NotificationFriend />
            <NotificationFriend />

            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />
            <NotificationChallenge />

            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />

          </div>
        </div>
        {/* </>: null
        } */}
      </nav> 
    </div>
  );
}