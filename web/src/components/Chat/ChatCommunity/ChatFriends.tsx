import './ChatFriends.scss';
import axios from 'axios';
import { DotsThreeVertical, MagnifyingGlass, PaperPlaneRight, UserPlus } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { FriendData } from '../../../Interfaces/interfaces';
import { stateStatus } from '../../../status/statusState';
import { Modal } from '../../Modal/Modal';
import { UserCardBlocked } from './UserCardBlocked';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { UserCardFriend } from './UserCardFriend';


interface ChatFriendsProps {
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export function ChatFriends({ setActiveFriend }: ChatFriendsProps) {
  const { intraData } = useContext(IntraDataContext);
  const currentStateStatus = useSnapshot(stateStatus);
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [isTableUsersMenu, setIsTableUsersMenu] = useState(false);
  const [isTableUsers, setIsTableUsers] = useState('friends');
  const [placeHolder, setPlaceHolder] = useState('');
  const [user_target, setUserTarget] = useState('');
  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFriendRequest();
  }

  async function sendFriendRequest() {
    console.log(user_target);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      await axios.patch(
        `http://${import.meta.env.VITE_API_HOST}:3000/user/sendFriendRequest`,
        { nick: user_target },
        config
      );
      setIsAddFriendModalVisible(false);
      setPlaceHolder('');
      currentStateStatus.socket?.emit('newNotify', user_target);
    } catch (err) {
      setPlaceHolder('Invalid nick!');

    }
    setUserTarget('');
  }

  useEffect(() => {
    console.log(intraData);
  }, []);

  return (
    < div className='chat__friends' >
      <div className='chat__friends__header'>
        <UserPlus
          className='chat__friends__header__icon' size={40}
          data-html={true}
          data-tip={'Add Friend'}
          onClick={() => setIsAddFriendModalVisible(true)}
        />

        < MagnifyingGlass className='chat__friends__header__icon'
          size={40}
          data-html={true}
          data-tip={'Search Friend'} />

        {/* <div className='chat__friends__header__icon__block'
          data-html={true}
          data-tip={'Blocked'}>
          <UserCircle className='chat__friends__header__icon' size={40} />
        </div> */}

        <div
          className='chat__friends__header__menu'
        >
          <DotsThreeVertical
            className='chat__friends__header__icon'
            size={40}
            onClick={() => setIsTableUsersMenu(!isTableUsersMenu)}
            data-html={true}
            data-tip={'Menu'}
          />
          {
            <div className='chat__friends__header__menu__body'
              style={{ height: isTableUsersMenu ? '90px' : '0px' }}>
              <button className='chat__friends__header__menu__button' onClick={() => setIsTableUsers('friends')}>Friends</button>
              <button className='chat__friends__header__menu__button' onClick={() => setIsTableUsers('blocked')}>Blocked</button>
            </div>
          }
        </div>

        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div>
      <>{isTableUsers === 'friends' ?
        < div className='chat__friends__body'>
          {intraData.friends.map((obj) => (
            <UserCardFriend key={Math.random()} friend={obj} setActiveFriend={setActiveFriend} />
          ))
          }
        </div>
        :
        <div className='chat__friends__body'>
          {intraData.blockeds.map((obj) => (
            <UserCardBlocked key={Math.random()} blocked={obj} />
          ))
          }
        </div>
      }
      </>
      {
        isAddFriendModalVisible &&
        <Modal
          onClose={() => {
            setIsAddFriendModalVisible(false);
            setPlaceHolder('');
            setUserTarget('');
          }}
          id={'modal__chatFriends'}
        >
          <form className='chat__friends__modal' onSubmit={handleKeyEnter}>
            <div className='chat__friends__modal__textdiv'>
              <h3>Insert user nick</h3>
              <input
                className='chat__friends__modal__input'
                value={user_target}
                placeholder={placeHolder}
                style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
                onChange={(msg) => {
                  setUserTarget(msg.target.value);
                  setPlaceHolder('');
                }}
              />
            </div>
            <button className='chat__friends__modal__button' type='submit'>
              <PaperPlaneRight size={30} />
            </button>
          </form>
        </Modal>
      }
    </div >);
}