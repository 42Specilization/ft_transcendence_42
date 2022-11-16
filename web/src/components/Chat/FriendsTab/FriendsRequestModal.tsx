import './FriendsRequestModal.scss';
import axios from 'axios';
import { PaperPlaneRight } from 'phosphor-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../status/statusState';
import { Modal } from '../../Modal/Modal';



interface FriendsRequestModalProps {
  setIsAddFriendModalVisible: Dispatch<SetStateAction<boolean>>;
}

export function FriendRequestModal({ setIsAddFriendModalVisible }: FriendsRequestModalProps) {

  const currentStateStatus = useSnapshot(stateStatus);
  const [placeHolder, setPlaceHolder] = useState('');
  const [userTarget, setUserTarget] = useState('');


  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFriendRequest();
  }

  async function sendFriendRequest() {
    console.log(userTarget);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      await axios.patch(
        `http://${import.meta.env.VITE_API_HOST}:3000/user/sendFriendRequest`,
        { nick: userTarget },
        config
      );
      setIsAddFriendModalVisible(false);
      setPlaceHolder('');
      currentStateStatus.socket?.emit('newNotify', userTarget);
    } catch (err) {
      setPlaceHolder('Invalid nick!');

    }
    setUserTarget('');
  }


  return (
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
            value={userTarget}
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
  );
}