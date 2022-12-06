import './ProfileUserCard.scss';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonChallenge } from '../../Button/ButtonChallenge';
import { ButtonSendMessage } from '../../Button/ButtonSendMessage';
import { ButtonBlockUser } from '../../Button/ButtonBlockUser';
import { ButtonAddFriend } from '../../Button/ButtonAddFriend';
import { ButtonRemoveFriend } from '../../Button/ButtonRemoveFriend';
import { ButtonUnBlockedUser } from '../../Button/ButtonUnBlockedUser';
import ReactTooltip from 'react-tooltip';

interface ProfileUserCardProps {
  profileUserData: {
    name: string,
    login: string,
    image_url: string,
    matches: string,
    wins: string,
    lose: string,
    relation: string,
  }
}

export function ProfileUserCard({ profileUserData }: ProfileUserCardProps) {

  const { name, login, image_url, relation } = profileUserData;

  return (
    <div className='profileUser__card'>
      <img className='profileUser__card__image'
        src={getUrlImage(image_url)} alt='friend_image' />
      <div className='profileUser__card__infos__nick'>
        <strong>{login}</strong>
      </div>
      <strong className='profileUser__card__infos'>{name}</strong>

      <div className='profileUser__card__buttons'>
        {!(relation === 'owner' || relation === 'blocked') &&
          <>
            {relation !== 'blocker' ?
              <>
                <ButtonSendMessage id={login} type={'person'} />
                <ButtonChallenge login={login} />
                {relation !== 'friend' ?
                  <ButtonAddFriend login={login} /> :
                  <ButtonRemoveFriend login={login} />
                }
                <ButtonBlockUser login={login} handle={null} params={[]} />
              </>
              :
              <ButtonUnBlockedUser login={login} />
            }
          </>
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}
