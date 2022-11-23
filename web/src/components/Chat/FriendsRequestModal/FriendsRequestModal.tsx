import './FriendsRequestModal.scss';
import { PaperPlaneRight } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { actionsStatus } from '../../../adapters/status/statusState';
import { Modal } from '../../Modal/Modal';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface FriendsRequestModalProps {
  setIsAddFriendModalVisible: Dispatch<SetStateAction<boolean>>;
}

export function FriendRequestModal({ setIsAddFriendModalVisible }: FriendsRequestModalProps) {

  const { api, config } = useContext(IntraDataContext);
  const [placeHolder, setPlaceHolder] = useState('');
  const [userTarget, setUserTarget] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendFriendRequest();
  }

  async function sendFriendRequest() {
    try {
      await api.patch('/user/sendFriendRequest', { nick: userTarget }, config);
      setIsAddFriendModalVisible(false);
      setPlaceHolder('');
      actionsStatus.newNotify(userTarget);
    } catch (err : any) {
      setPlaceHolder(err.response.data.message);
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
            ref={e => e?.focus()}
          />
        </div>
        <button className='chat__friends__modal__button' type='submit'>
          <PaperPlaneRight size={30} />
        </button>
      </form>
    </Modal>
  );
}