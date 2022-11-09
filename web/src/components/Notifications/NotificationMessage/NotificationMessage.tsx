import { TelegramLogo } from 'phosphor-react';
import './NotificationMessage.scss';

export function NotificationMessage() {
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