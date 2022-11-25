import { DotsThreeVertical, UserPlus } from 'phosphor-react';
import { useState, useContext } from 'react';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import './CardCommunity.scss';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Modal } from '../../Modal/Modal';
interface CardCommunityProps {
  image_url: string;
  login: string;
  ratio: string;
}

export function CardCommunity({image_url, login, ratio}: CardCommunityProps) {
  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const {api, config} = useContext(IntraDataContext);
  function selectAction(e: any) {
    if (e.target.id === 'cardCommunity') {
      setFriendProfileVisible((prev) => !prev);
    }
  }

  async function sendFriendRequest() {
    try {
      await api.patch('/user/sendFriendRequest', { nick: login }, config);
      actionsStatus.newNotify(login);
    } catch (err : unknown) {
      setModalErrorVisible(true);
    }
  }

  return (
    <>
      <div id='cardCommunity' className='cardCommunity' 
        onClick={(e) => selectAction(e)}
      >
        <div id='cardCommunity' className='cardCommunity__icon'
          style={{ backgroundImage: `url(${image_url})` }}>
        </div>
           
        <div id='cardCommunity' className='cardCommunity__name'>{login}</div>
        <span className='cardCommunity__ratio' > Ratio: {ratio}</span>
        <div className='cardCommunity__menu'>
          <div id='cardCommunity__menu__body' className='cardCommunity__menu__body'
            style={{ height: isTableFriendUsersMenu ? '55px' : '0px', width: isTableFriendUsersMenu ? '80px' : '0px' }}>
            <button className='cardCommunity__menu__button'
              onClick={() => sendFriendRequest()}
              data-html={true}
              data-tip={'Add Friend'}>
              <UserPlus size={32} />
            </button>
          </div>

          <DotsThreeVertical
            id='cardCommunity__menu'
            className='cardCommunity__header__icon'
            size={40}
            onClick={() => setIsTableFriendUsersMenu(prev => !prev)}
            data-html={true}
            data-tip={'Menu'}
          />
          <ReactTooltip className='cardCommunity__header__icon__tip' delayShow={50} />
        </div>
        {friendProfileVisible &&
            <ProfileFriendModal
              login={login}
              setFriendProfileVisible={setFriendProfileVisible} />
        }
        {modalErrorVisible &&
            <Modal onClose={() => setModalErrorVisible(false)}>
              <p className='cardCommunity__error'>User already your friend</p>
            </Modal>
        }
      </div >
    </>
  );
}
