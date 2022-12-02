import './CardFriend.scss';
import ReactTooltip from 'react-tooltip';
import { FriendData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { DotsThreeVertical, TelegramLogo, Sword, UserMinus } from 'phosphor-react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ChatContext } from '../../../contexts/ChatContext';
import { Link } from 'react-router-dom';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { getUrlImage } from '../../../others/utils/utils';
import { Modal } from '../../Modal/Modal';
import { Challenge } from '../../Game/Challenge/Challenge';

interface CardFriendProps {
  friend: FriendData;
}

export function CardFriend({ friend }: CardFriendProps) {

  const { setSelectedChat } = useContext(ChatContext);
  const { setIntraData, api, config } = useContext(IntraDataContext);
  const [activeMenu, setActiveMenu] = useState(false);
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

        <div className='card__friend__menu'>
          <div id='card__friend__menu__body' className='card__friend__menu__body'
            style={{ height: activeMenu ? '145px' : '0px', width: activeMenu ? '80px' : '0px' }}>

            <button className='card__friend__menu__button'
              onClick={handleChallenger}
              data-html={true}
              data-tip={'Challenge'}>
              <Sword size={32} />
            </button>
            <Link to='/chat'>
              <button className='card__friend__menu__button'
                onClick={handleSendMessage}
                data-html={true}
                data-tip={'Send Message'}
              >
                <TelegramLogo size={32} />
              </button>
            </Link>
            <button
              className='card__friend__menu__button'
              onClick={handleRemoveFriend}
              data-html={true}
              data-tip={'Remove Friend'}
            >
              <UserMinus size={32} />
            </button>
          </div>

          <DotsThreeVertical
            id='card__friend__menu'
            className='chat__friends__header__icon'
            size={40}
            onClick={() => setActiveMenu(prev => !prev)}
            data-html={true}
            data-tip={'Menu'}
          />
          <ReactTooltip delayShow={50} />
        </div>
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
