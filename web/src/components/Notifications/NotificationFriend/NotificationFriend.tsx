import './NotificationFriend.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { NotifyData } from '../../../Interfaces/interfaces';
import axios from 'axios';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../status/statusState';
import { getUserInDb } from '../../../utils/utils';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';

interface NotificationFriendProps {
  notify: NotifyData;
}
export function NotificationFriend({ notify }: NotificationFriendProps) {
  const currentStateStatus = useSnapshot(stateStatus);
  const [side, setSide] = useState(true);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);

  useEffect(() => {
    console.log('notify', notify);
  }, []);


  async function handleReject() {
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
    const response = await api.patch('/user/removeNotify', { id: notify.id }, config);
    console.log(response);
    currentStateStatus.socket?.emit('newNotify', intraData.login);
  }

  function changeSide(event: any) {
    if (event.target.id === 'front_side' || event.target.id === 'back_side') {
      setSide(prevSide => !prevSide);
    }
  }


  return (
    <>
      <div id={'front_side'} className='notificationFriend__frontSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '100%' : '0px') }}>
        <strong id={'front_side'} className='notificationFriend__frontSide__nick'>
          {notify.user_source}
        </strong>
        <strong id={'front_side'} className='notificationFriend__frontSide__text'>
          send you a friend request
        </strong>
      </div >

      <div id={'back_side'} className='notificationFriend__backSide'
        onClick={(e) => changeSide(e)}
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
        <div className='notificationFriend__backSide__button'
          onClick={() => setFriendProfileVisible(true)}>
          <p> Profile
            <UserCircle size={22} />
          </p>
       
        </div>
        {friendProfileVisible &&
          <ProfileFriendModal
            login={notify.user_source}
            setFriendProfileVisible={setFriendProfileVisible} />
        }
      </div >
    </>
  );
}
