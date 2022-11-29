import { DotsThreeVertical, TelegramLogo, UserPlus } from 'phosphor-react';
import { useState, useContext } from 'react';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import './CardGlobal.scss';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Modal } from '../../Modal/Modal';
import { ChatContext } from '../../../contexts/ChatContext';
import { Link } from 'react-router-dom';

interface CardGlobalProps {
  image_url: string;
  login: string;
  ratio: string;
}

export function CardGlobal({ image_url, login, ratio }: CardGlobalProps) {
  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const { api, config } = useContext(IntraDataContext);
  const { setPeopleChat } = useContext(ChatContext);

  function selectAction(e: any) {
    if (e.target.id === 'cardGlobal') {
      setFriendProfileVisible((prev) => !prev);
    }
  }

  function handleSendMessage() {
    setPeopleChat({
      status: 'offline',
      login: login,
      image_url: image_url,
    });
  }

  async function sendFriendRequest() {
    try {
      await api.patch('/user/sendFriendRequest', { nick: login }, config);
      actionsStatus.newNotify(login, 'friend');
    } catch (err: unknown) {
      setModalErrorVisible(true);
    }
  }

  return (
    <>
      <div id='cardGlobal' className='cardGlobal'
        onClick={(e) => selectAction(e)}
      >
        <div id='cardGlobal' className='cardGlobal__icon'
          style={{ backgroundImage: `url(${image_url})` }}>
        </div>

        <div id='cardGlobal' className='cardGlobal__name'>{login}</div>
        <span className='cardGlobal__ratio' > Ratio: {ratio}</span>
        <div className='cardGlobal__menu'>
          <div id='cardGlobal__menu__body' className='cardGlobal__menu__body'
            style={{ height: isTableFriendUsersMenu ? '100px' : '0px', width: isTableFriendUsersMenu ? '80px' : '0px' }}>
            <button className='cardGlobal__menu__button'
              onClick={() => sendFriendRequest()}
              data-html={true}
              data-tip={'Add Friend'}>
              <UserPlus size={32} />
            </button>
            <Link to='/chat'>
              <button className='cardGlobal__menu__button'
                onClick={handleSendMessage}
                data-html={true}
                data-tip={'Send Message'}
              >
                <TelegramLogo size={32} />
              </button>
            </Link>
          </div>

          <DotsThreeVertical
            id='cardGlobal__menu'
            className='cardGlobal__header__icon'
            size={40}
            onClick={() => setIsTableFriendUsersMenu(prev => !prev)}
            data-html={true}
            data-tip={'Menu'}
          />
          <ReactTooltip className='cardGlobal__header__icon__tip' delayShow={50} />
        </div>
        {friendProfileVisible &&
          <ProfileFriendModal
            login={login}
            setFriendProfileVisible={setFriendProfileVisible} />
        }
        {modalErrorVisible &&
          <Modal onClose={() => setModalErrorVisible(false)}>
            <p className='cardGlobal__error'>User already your friend</p>
          </Modal>
        }
      </div >
    </>
  );
}
