import './NotificationFriend.scss';
import { CheckCircle, XCircle } from 'phosphor-react';
export function NotificationFriend() {
	return (
		<div className='notificationFriend'>
			<strong>User send you a friend request</strong>
			<div className='notificationFriend__buttons'>
				<div className='notificationFriend__buttons__accept'>
					<p> Accept </p>
					<CheckCircle size={22} color=' rgb(2, 253, 2)' />
				</div>
				<div className='notificationFriend__buttons__reject'>
					<p> Reject </p>
					<XCircle size={22} color='red' />
				</div>
			</div>
		</div >
	);
}
