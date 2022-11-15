import './NotificationFriend.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { NotifyData } from '../../../Interfaces/interfaces';
import axios from 'axios';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../status/statusState';
import { getUserInDb } from '../../../utils/utils';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface NotificationFriendProps {
  notify: NotifyData;
}
export function NotificationFriend({ notify }: NotificationFriendProps) {
  const currentStateStatus = useSnapshot(stateStatus);
  const [side, setSide] = useState(true);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const { intraData, setIntraData } = useContext(IntraDataContext);


  useEffect(() => {
    console.log('notify', notify);
  }, []);

  const token = useMemo(() => window.localStorage.getItem('token'), []);

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const api = useMemo(() => axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  }), []);

  async function handleAccept() {

    await api.patch('/user/acceptFriend', { id: notify.id }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
    currentStateStatus.socket?.emit('newFriend', notify.user_source);
  }

  async function handleBlock() {

    await api.patch('/user/blockUserByNotification', { id: notify.id }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
    currentStateStatus.socket?.emit('newBlocked');
  }

  async function handleReject() {
    console.log('clicou');
    // Talvez colocar uma validação de confirmação
    await api.patch('/user/removeNotify', { id: notify.id }, config);

    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
    // currentStateStatus.socket?.emit('newNotify', intraData.login);
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
        <div className='notificationFriend__backSide__button' onClick={handleAccept}>
          <p> Accept </p>
          <CheckCircle size={22} />
        </div>
        <div className='notificationFriend__backSide__button' onClick={handleReject}>
          <p> Reject </p>
          <XCircle size={22} />
        </div>
        <div className='notificationFriend__backSide__button' onClick={handleBlock}>
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
