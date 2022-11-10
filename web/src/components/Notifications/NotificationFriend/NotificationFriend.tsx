import './NotificationFriend.scss';
import { CheckCircle, XCircle } from 'phosphor-react';

interface NotificationFriendProps {
  nick: string;
}
export function NotificationFriend({nick}: NotificationFriendProps) {
  /**
   * Pode ocorrer uma requisição a partir daqui respondendo a solicitação amizade
   * Enviando o nick do usuario, o nick de quem pediu e a resposta dependendo do botao apertado
   * 
   */
  return (
    <div className='notificationFriend'>
      <strong>{nick} send you a friend request</strong>
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
