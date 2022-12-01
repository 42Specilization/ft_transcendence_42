import './NotificationMessage.scss';
import { TelegramLogo } from 'phosphor-react';
import { NotifyData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Link } from 'react-router-dom';

interface NotificationMessageProps {
  notify: NotifyData;
}

export function NotificationMessage({
  notify
}: NotificationMessageProps) {

  const [side, setSide] = useState(true);
  const { setIntraData, api, config } = useContext(IntraDataContext);

  function changeSide(event: any) {
    if (event.target.id === 'front_side' || event.target.id === 'back_side') {
      setSide(prevSide => !prevSide);
    }
  }
  
  async function removeNotify() {
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
  }

  async function handleGoToChat() {
    await api.patch('/user/removeNotify', { id: notify.id }, config);
    removeNotify();
  }


  return (
    <>
      <div id={'front_side'} className='notificationMessage__frontSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '100%' : '0px') }}>
        {
          notify.additional_info?.includes('direct') ?
            <>
              <strong id={'front_side'} className='notificationMessage__frontSide__nick'>
                {notify.user_source}
              </strong>
              <strong id={'front_side'} className='notificationMessage__frontSide__text'>
                sent you a message
              </strong>
            </>
            :
            <>
              <strong id={'front_side'} className='notificationMessage__frontSide__text'>
                New message in Group
              </strong>
              <strong id={'front_side'} className='notificationMessage__frontSide__nick'>
                {notify.user_source}
              </strong>
            </>
        }
      </div >

      <div id={'back_side'} className='notificationMessage__backSide'
        onClick={(e) => changeSide(e)}
        style={{ width: (side ? '0px' : '100%') }}
      >
        <Link to='/chat' className='notificationMessage__backSide__button' onClick={handleGoToChat}>
          <TelegramLogo size={40} />
          <p> Go to Chat </p>
        </Link>
      </div >
    </>
  );
}