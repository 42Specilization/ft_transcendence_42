import './CardFriend.scss';
import { useState } from 'react';
import { UserData } from '../../../../others/Interfaces/interfaces';
import { getUrlImage } from '../../../../others/utils/utils';
import { ProfileUserModal } from '../../../ProfileUser/ProfileUserModal/ProfileUserModal';
import ReactTooltip from 'react-tooltip';

interface CardFriendProps {
  friend: UserData;
}

export function CardFriend({ friend }: CardFriendProps) {
  const [friendProfileVisible, setProfileUserVisible] = useState(false);

  function modalVisible(event: any) {
    if (event.target.id === 'card__friend')
      setProfileUserVisible(true);
  }

  return (
    <>
      <div id='card__friend' className='card__friend'
        onClick={modalVisible}
      >
        <div id='card__friend' className='card__friend__icon'
          style={{ backgroundImage: `url(${getUrlImage(friend.image_url)})` }}>
          <div id='card__friend' className='card__friend__status'
            data-html={true}
            data-tip={(() => {
              if (friend.status === 'online') {
                return ('online');
              } else if (friend.status === 'inGame') {
                return ('in game');
              } else {
                return ('offline');
              }
            })()}
            style={{
              backgroundColor:
                (() => {
                  if (friend.status === 'online') {
                    return ('green');
                  } else if (friend.status === 'inGame') {
                    return ('rgb(255, 180, 0)');
                  } else {
                    return ('rgb(70, 70, 70)');
                  }
                })()
            }} />

        </div>
        <ReactTooltip delayShow={50} />
        <div id='card__friend' className='card__friend__name'>{friend.login}</div>
      </div >
      {friendProfileVisible &&
        <ProfileUserModal
          login={friend.login}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}
