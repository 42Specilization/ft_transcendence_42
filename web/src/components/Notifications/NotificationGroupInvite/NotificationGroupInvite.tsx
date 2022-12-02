import './NotificationGroupInvite.scss';
import { CheckCircle, UserCircle, XCircle } from 'phosphor-react';
import { useContext, useState } from 'react';
import { NotifyData } from '../../../others/Interfaces/interfaces';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsChat } from '../../../adapters/chat/chatState';
import { ProfileGroupModal } from '../../ProfileGroupModal/ProfileGroupModal';
import { ConfirmActionModal } from '../../ConfirmActionModal/ConfirmActionModal';

interface NotificationGroupInviteProps {
  notify: NotifyData;
}
export function NotificationGroupInvite({ notify }: NotificationGroupInviteProps) {

  const [side, setSide] = useState(true);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);
  const { api, config, intraData, setIntraData } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState('');
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
      actionsChat.joinGroup(notify.additional_info, intraData.email);
    } catch (err: any) {
      if (err.response.data.message == 'This user already is your friend') {
        removeNotify();
      }
    }
  }

  async function handleReject() {
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
        <div className='notificationGroupInvite__backSide__button' onClick={()=> setConfirmActionVisible('reject')}>
          <p> Reject </p>
          <XCircle size={22} />
        </div>

        <div className='notificationGroupInvite__backSide__button'
          onClick={() => setProfileGroupVisible(true)}>
          <p> Profile
            <UserCircle size={22} />
          </p>

        </div>
        {profileGroupVisible &&
          <ProfileGroupModal
            id='profile__group__modal'
            setProfileGroupVisible={setProfileGroupVisible} />
        }
        {(() => {
          if (confirmActionVisible === 'reject'){
            return <ConfirmActionModal
              title={'Reject Invite?'}
              onClose={() => setConfirmActionVisible('')}
              confirmationFunction={handleReject}
            />;
          }       
        })()}

      </div >
    </>
  );
}
