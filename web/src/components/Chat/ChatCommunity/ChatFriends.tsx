import axios from 'axios';
import { MagnifyingGlass, PaperPlaneRight, UserPlus} from 'phosphor-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FriendData } from '../../../Interfaces/interfaces';
import { Modal } from '../../Modal/Modal';
import './ChatFriends.scss';
import { UserCard } from './UserCard';

interface ChatFriendsProps {
  friends: FriendData[];
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export default function ChatFriends({
  friends,
  setActiveFriend,
}: ChatFriendsProps) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [placeHolder, setPlaceHolder] = useState('');
  const [nick, setNick] = useState('');
  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFriendRequest();
  }

  async function sendFriendRequest() {
    console.log(nick);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      await axios.patch(
        `http://${import.meta.env.VITE_API_HOST}:3000/user/sendFriendRequest`,
        { nick: nick },
        config
      );
      setIsAddFriendModalVisible(false);
      setPlaceHolder('');
    } catch (err) {
      setPlaceHolder('Invalid nick!');

    }
    setNick('');
  }

  return (
    < div className='chat__friends' >
      <div className='chat__friends__header'>
        <UserPlus className='chat__friends__header__icon' size={40}
          onClick={() => setIsAddFriendModalVisible(true)} />
        < MagnifyingGlass className='chat__friends__header__icon' size={40} />
      </div>
      <div className='chat__friends__body'>

        {friends.map((obj) => (
          <UserCard key={obj.login} friend={obj} setActiveFriend={setActiveFriend} />
        ))
        }
      </div>
      {
        isAddFriendModalVisible ?
          <Modal
            onClose={() => {
              setIsAddFriendModalVisible(false);
              setPlaceHolder('');
              setNick('');
            }}
            id={'modal__chatFriends'}
          >
            <form className='chat__friends__modal' onSubmit={handleKeyEnter}>
              <div className='chat__friends__modal__textdiv'>
                <h3>Insert user nick</h3>
                <input
                  className='chat__friends__modal__input'
                  value={nick}
                  placeholder={placeHolder}
                  style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
                  onChange={(msg) => {
                    setNick(msg.target.value);
                    setPlaceHolder('');
                  }}
                />
              </div>
              <button className='chat__friends__modal__button' type='submit'>
                <PaperPlaneRight size={30} />
              </button>
            </form>
          </Modal> : null
      }
    </div >);
}