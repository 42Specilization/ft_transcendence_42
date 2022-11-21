import './NotificationMessage.scss';
import { TelegramLogo } from 'phosphor-react';
import { NotificationData } from '../../../others/Interfaces/interfaces';

interface NotificationMessageProps {
  notify: NotificationData;
}

export function NotificationMessage({
  notify
}: NotificationMessageProps) {
  return (
    <div className='notificationMessage'>
      <strong>User sent you a message </strong>
      <div className='notificationMessage__button'>
        <TelegramLogo size={22} />
        <p> Go to chat </p>
      </div>
    </div>
  );
}