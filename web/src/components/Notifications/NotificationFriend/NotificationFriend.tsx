import './NotificationFriend.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useState } from 'react';
import { NotifyData } from '../../../Interfaces/interfaces';
import { Link } from 'react-router-dom';

interface NotificationFriendProps {
  notify: NotifyData;
}
export function NotificationFriend({ notify }: NotificationFriendProps) {

  const [side, setSide] = useState(true);
  
  
  return (
    <>
      <div className='notificationFriend__frontSide'
        onClick={() => setSide(prevSide => !prevSide)}
        style={{ width: (side ? '100%' : '0px') }}>
        <strong className='notificationFriend__frontSide__nick'>
          {notify.user_source}
        </strong>
        <strong className='notificationFriend__frontSide__text'>
          send you a friend request
        </strong>
      </div >

      <div className='notificationFriend__backSide'
        onClick={() => setSide(prevSide => !prevSide)}
        style={{ width: (side ? '0px' : '100%') }}
      >
        <div className='notificationFriend__backSide__button'>
          <p> Accept </p>
          <CheckCircle size={22} />
        </div>
        <div className='notificationFriend__backSide__button'>
          <p> Reject </p>
          <XCircle size={22} />
        </div>
        <div className='notificationFriend__backSide__button'>
          <p> Block </p>
          <Prohibit size={22} />
        </div>
        <div className='notificationFriend__backSide__button'>
          <Link to={`/devFriend/${notify.user_source}`} >
            <p> Profile 
              <UserCircle size={22} />
            </p>
          </Link>
        </div>
      </div >
    </>
  );
}
