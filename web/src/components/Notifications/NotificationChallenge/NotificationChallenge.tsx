import './NotificationChallenge.scss';
import { CheckCircle, XCircle } from 'phosphor-react';

export function NotificationChallenge() {
  return (
    <div className='notificationChallenge'>
      <strong>User send you a challenge request</strong>
      <div className='notificationChallenge__buttons'>
        <div className='notificationChallenge__buttons__accept'>
          <p> Accept</p>
          <CheckCircle size={22} color=' rgb(2, 253, 2)' />
        </div>
        <div className='notificationChallenge__buttons__reject'>
          <p> Reject </p>
          <XCircle size={22} color='red' />
        </div>
      </div>
    </div >
  );
}
