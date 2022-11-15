import './NotificationFriend.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { IntraData, NotifyData } from '../../../Interfaces/interfaces';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../status/statusState';
import { getUserInDb } from '../../../utils/utils';

interface NotificationFriendProps {
  notify: NotifyData;
}
export function NotificationFriend({ notify }: NotificationFriendProps) {
  const currentStateStatus = useSnapshot(stateStatus);
  const [side, setSide] = useState(true);
    
  useEffect(() => {
    console.log('notify',notify);
  }, []);


  async function handleReject(){
    console.log('clicou');
    // Talvez colocar uma validação de confirmação

    const token = window.localStorage.getItem('token');
    const intraData = await getUserInDb();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });
    const response = await api.patch('/user/removeNotify', {id:notify.id} ,config);
    console.log(response);
    currentStateStatus.socket?.emit('newNotify', intraData.login);  
  }



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
        <div className='notificationFriend__backSide__button' onClick={handleReject}>
          <p> Reject </p>
          <XCircle size={22} />
        </div>
        <div className='notificationFriend__backSide__button'>
          <p> Block </p>
          <Prohibit size={22} />
        </div>
        <div className='notificationFriend__backSide__button'>
          <Link to={`/friend/${notify.user_source}`} >
            <p> Profile 
              <UserCircle size={22} />
            </p>
          </Link>
        </div>
      </div >
    </>
  );
}
