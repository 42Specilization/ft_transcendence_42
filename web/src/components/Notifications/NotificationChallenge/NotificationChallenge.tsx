import './NotificationChallenge.scss';
import { CheckCircle, XCircle } from 'phosphor-react';
import { NotifyData } from '../../../others/Interfaces/interfaces';
import { actionsGame } from '../../../adapters/game/gameState';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Link } from 'react-router-dom';

interface NotificationChallengeProps {
  notify: NotifyData;
}

export function NotificationChallenge(
  { notify }: NotificationChallengeProps
) {

  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);

  async function removeNotify() {
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        notify: prevIntraData.notify.filter((key) => key.id != notify.id)
      };
    });
  }

  async function handleAcceptChallenge() {
    actionsGame.initializeSocket();
    actionsGame.acceptChallenge(Number(notify.additional_info), intraData.login, notify.user_source);
    await api.patch('/user/removeNotify', { id: notify.id }, config);
    removeNotify();
  }

  async function handleRejectChallenge() {
    await api.patch('/user/removeNotify', { id: notify.id }, config);
    removeNotify();
    actionsGame.initializeSocket();
    actionsGame.rejectChallenge(notify.additional_info);
    actionsGame.disconnectSocket();
  }

  return (

    <div className='notificationChallenge'>
      <strong>{notify.user_source} send you a challenge request</strong>
      <div className='notificationChallenge__buttons'>
        <div className='notificationChallenge__buttons__accept' onClick={handleAcceptChallenge}>
          <Link className='notificationChallenge__buttons__accept__link' to='/game'>
            <p> Accept</p>
            <CheckCircle size={22} color=' rgb(2, 253, 2)' />
          </Link>
        </div>
        <div className='notificationChallenge__buttons__reject' onClick={handleRejectChallenge}>
          <p> Reject </p>
          <XCircle size={22} color='red' />
        </div>
      </div>
    </div >
  );
}
