import './CardFriend.scss';
import { FriendData } from '../../../others/Interfaces/interfaces';
import {  useState } from 'react';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { getUrlImage } from '../../../others/utils/utils';
import { Modal } from '../../Modal/Modal';
import { Challenge } from '../../Game/Challenge/Challenge';

interface CardFriendProps {
  friend: FriendData;
}

export function CardFriend({ friend }: CardFriendProps) {
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [challengeModal, setChallengeModal] = useState(false);

  function handleChallenger() {
    setChallengeModal(true);
  }

  function handleSendMessage() {
    setSelectedChat({ chat: friend.login, type: 'person' });
  }

  async function handleRemoveFriend() {
    await api.patch('/user/removeFriend', { nick: friend.login }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        friends: prevIntraData.friends.filter((key) => key.login != friend.login)
      };
    });
    actionsStatus.removeFriend(friend.login);
  }


  function modalVisible(event: any) {
    if (event.target.id === 'card__friend')
      setFriendProfileVisible(true);
  }

  return (
    <>
      <div id='card__friend' className='card__friend'
        onClick={modalVisible}
      >
        <div id='card__friend' className='card__friend__icon'
          style={{ backgroundImage: `url(${getUrlImage(friend.image_url)})` }}>
          <div id='card__friend' className='card__friend__status'
            style={{ backgroundColor: friend.status === 'online' ? 'green' : 'rgb(70, 70, 70)' }} />
        </div>
        <div id='card__friend' className='card__friend__name'>{friend.login}</div>
      </div >
      {friendProfileVisible &&
        <ProfileFriendModal
          login={friend.login}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
      {
        challengeModal &&
        <Modal onClose={() => setChallengeModal(false)} id='card__modal__challenge'>
          <Challenge path='/game' nick={friend.login} />
        </Modal>
      }
    </>
  );
}
