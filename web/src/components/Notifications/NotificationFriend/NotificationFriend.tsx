import './NotificationFriend.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useState } from 'react';
import { NotificationData } from '../../../Interfaces/interfaces';

interface NotificationFriendProps {
  notify: NotificationData;
}
export function NotificationFriend({ notify }: NotificationFriendProps) {

  const [side, setSide] = useState(true);

  return (
    <>
      <div className='notificationFriend__frontSide'
        onClick={() => setSide(prevSide => !prevSide)}
        style={{ width: (side ? '100%' : '0px') }}>
        <strong className='notificationFriend__frontSide__nick'>
          {notify.source_nick}
        </strong>
        <strong className='notificationFriend__frontSide__text'>
          send you a friend request
        </strong>
      </div >

      <div className='notificationFriend__backSide'
        onClick={() => setSide(prevSide => !prevSide)}
        style={{ width: (side ? '0px' : 'calc(100% - 20px)') }}
      >
        <div className='notificationFriend__backSide__column'>
          <div className='notificationFriend__backSide__button'>
            <p> Accept </p>
            <CheckCircle size={22}/>
          </div>
          <div className='notificationFriend__backSide__button'>
            <p> Reject </p>
            <XCircle size={22} />
          </div>
        </div>
        <div className='notificationFriend__backSide__column'>
          <div className='notificationFriend__backSide__button'>
            <p> Block </p>
            <Prohibit size={22}/>
          </div>
          <div className='notificationFriend__backSide__button'>
            <p> Show Perfil </p>
            <UserCircle size={22}/>
          </div>
        </div>


      </div >
    </>
  );
}
