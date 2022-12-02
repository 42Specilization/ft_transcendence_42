import './CardOwner.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useState } from 'react';
import { Crown } from 'phosphor-react';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { getUrlImage } from '../../../others/utils/utils';

interface CardOwnerProps {
  member: MemberData;
}

export function CardOwner({ member }: CardOwnerProps) {

  const [friendProfileVisible, setFriendProfileVisible] = useState(false);

  function modalVisible(event: any) {
    if (event.target.id === 'card__owner')
      setFriendProfileVisible(true);
  }

  return (
    <>
      <div id='card__owner' className='card__owner' onClick={modalVisible}>
        <div id='card__owner' className="card__owner__div">
          <div id='card__owner'
            className='card__owner__icon'
            style={{ backgroundImage: `url(${getUrlImage(member.image)})` }}>
          </div>
          <div id='card__owner' className='card__owner__name'>
            <span id='card__owner'>{member.name}</span>
            <Crown id='card__owner' size={32} />
          </div>
        </div>
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div >
      {friendProfileVisible &&
        <ProfileFriendModal
          login={member.name}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
    </>
  );
}