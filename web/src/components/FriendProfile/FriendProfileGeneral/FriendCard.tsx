import './FriendCard.scss';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonChallenge } from '../../Button/ButtonChallenge';
import { ButtonSendMessage } from '../../Button/ButtonSendMessage';
import { ButtonBlockUser } from '../../Button/ButtonBlockUser';
import { ButtonAddFriend } from '../../Button/ButtonAddFriend';
import { ButtonRemoveFriend } from '../../Button/ButtonRemoveFriend';
import { ButtonUnBlockedUser } from '../../Button/ButtonUnBlockedUser';
import ReactTooltip from 'react-tooltip';

interface FriendCardProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
    relation: string
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
        {friendData.relation !== 'blocked' ?
          <>
            <ButtonSendMessage id={friendData.login} type={'person'} />
            <ButtonChallenge login={friendData.login} />
            {friendData.relation !== 'friend' ?
              <ButtonAddFriend login={friendData.login} /> :
              <ButtonRemoveFriend login={friendData.login} />
            }
            <ButtonBlockUser login={friendData.login} image={friendData.image_url} />
          </>
          :
          <ButtonUnBlockedUser login={friendData.login} />
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}
