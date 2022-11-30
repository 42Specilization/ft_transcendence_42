import './NotificationGroupInvite.scss';
import { CheckCircle, Prohibit, UserCircle, XCircle } from 'phosphor-react';
import { useContext, useState } from 'react';
import { NotifyData } from '../../../others/Interfaces/interfaces';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsChat } from '../../../adapters/chat/chatState';
import { ProfileGroupModal } from '../../ProfileGroupModal/ProfileGroupModal';

interface NotificationGroupInviteProps {
  notify: NotifyData;
}
export function NotificationGroupInvite({ notify }: NotificationGroupInviteProps) {

  const [side, setSide] = useState(true);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);
  const { api, config, intraData, setIntraData } = useContext(IntraDataContext);

  async function removeNotify() {
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
  }

  async function handleAccept() {
    try {
      await api.patch('/user/removeNotify', { id: notify.id }, config);
      removeNotify();
      console.log('Aceitou a notificação', notify.user_source);
      actionsChat.joinGroup(notify.additional_info, intraData.email);
    } catch (err: any) {
      if (err.response.data.message == 'This user already is your friend') {
        removeNotify();
      }
    }
  }

  async function handleBlock() {
    await api.patch('/user/blockUserByNotification', { id: notify.id }, config);
    removeNotify();
    actionsStatus.newBlocked();
  }

  async function handleReject() {
    // Talvez colocar uma validação de confirmação
    await api.patch('/user/removeNotify', { id: notify.id }, config);
    removeNotify();
  }

  function changeSide(event: any) {
    if (event.target.id === 'front_side' || event.target.id === 'back_side') {
      setSide(prevSide => !prevSide);
    }
  }

  return (
    <>
      <div id={'front_side'} className='notificationGroupInvite__frontSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '100%' : '0px') }}>
        <strong id={'front_side'} className='notificationGroupInvite__frontSide__nick'>
          {notify.user_source}
        </strong>
        <strong id={'front_side'} className='notificationGroupInvite__frontSide__text'>
          send you a group invite
        </strong>
      </div >

      <div id={'back_side'} className='notificationGroupInvite__backSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '0px' : '100%') }}
      >
        <div className='notificationGroupInvite__backSide__button' onClick={handleAccept}>
          <p> Accept </p>
          <CheckCircle size={22} />
        </div>
        <div className='notificationGroupInvite__backSide__button' onClick={handleReject}>
          <p> Reject </p>
          <XCircle size={22} />
        </div>
        <div className='notificationGroupInvite__backSide__button' onClick={handleBlock}>
          <p> Block </p>
          <Prohibit size={22} />
        </div>

        <div className='notificationGroupInvite__backSide__button'
          onClick={() => setProfileGroupVisible(true)}>
          <p> Profile
            <UserCircle size={22} />
          </p>

        </div>
        {profileGroupVisible &&
          <ProfileGroupModal
            id={notify.additional_info}
            setProfileGroupVisible={setProfileGroupVisible} />
        }

      </div >
    </>
  );
}
