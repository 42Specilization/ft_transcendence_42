import './FriendCard.scss';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonChallenge } from '../../Button/ButtonChallenge';
import { ButtonSendMessage } from '../../Button/ButtonSendMessage';
import { ButtonBlockUser } from '../../Button/ButtonBlockUser';
import { ButtonAddFriend } from '../../Button/ButtonAddFriend';
import { ButtonRemoveFriend } from '../../Button/ButtonRemoveFriend';

interface FriendCardProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
  };
}

export function FriendCard({ friendData }: FriendCardProps) {

  return (
    <div className='friendCard'>
      <img className='friendCard_image' src={getUrlImage(friendData.image_url)} alt='friend_image' />
      <div className='friendCard__infos__nick'>
        <strong>{friendData.login}</strong>
      </div>
      <strong className='friendCard__infos'>{friendData.name}</strong>
      <div className='friendCard__buttons'>
        <ButtonChallenge login={friendData.login} />
        <ButtonSendMessage id={friendData.login} type={'person'} />
        <ButtonAddFriend login={friendData.login} />
        <ButtonRemoveFriend login={friendData.login} />
        <ButtonBlockUser login={friendData.login} image={friendData.image_url} />
      </div>
    </div >
  );
}
