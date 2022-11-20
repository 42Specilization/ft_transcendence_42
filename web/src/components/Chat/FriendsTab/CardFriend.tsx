import './CardFriend.scss';
import { FriendData } from '../../../others/Interfaces/interfaces';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { DotsThreeVertical, Prohibit, Sword, UserMinus } from 'phosphor-react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../adapters/status/statusState';
import { ChatContext } from '../../../contexts/ChatContext';

interface CardFriendProps {
  friend: FriendData;
  setTableSelected: Dispatch<SetStateAction<string>>;
}

export function CardFriend({ friend, setTableSelected }: CardFriendProps) {
  const { setFriendsChat } = useContext(ChatContext);
  const [isTableFriendUsersMenu, setIsTableFriendUsersMenu] = useState(false);
  const currentStateStatus = useSnapshot(stateStatus);
  const { setIntraData, api, config } = useContext(IntraDataContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function selectActiveFriend(e: any) {
    if (e.target.id === 'card__friend') {
      setFriendsChat(friend);
      setTableSelected('Directs');
    }
  }

  async function handleRemoveFriend() {
    await api.patch('/user/removeFriend', { nick: friend.login }, config);
    setIntraData((prevIntraData) => {
      return {
        ...prevIntraData,
        friends: prevIntraData.friends.filter((key) => key.login != friend.login)
      };
    });
    currentStateStatus.socket?.emit('deleteFriend', friend.login);
  }

  async function handleBlockFriend() {
    await api.patch('/user/addBlocked', { nick: friend.login }, config);
    setIntraData((prevIntraData) => {
      prevIntraData.blockeds.push(friend);
      return {
        ...prevIntraData,
        friends: prevIntraData.friends.filter((key) => key.login != friend.login),
      };
    });
    currentStateStatus.socket?.emit('deleteFriend', friend.login);
  }

  return (
    <div className='card__friend'
      id='card__friend'
      onClick={(e) => selectActiveFriend(e)}
    >
      <div className='card__friend__div'>
        <div
          className='card__friend__icon'
          style={{ backgroundImage: `url(${friend.image_url})` }}
        >
          <div className='card__friend__status'
            style={{ backgroundColor: friend.status === 'online' ? 'green' : 'rgb(70, 70, 70)' }}>
          </div>
        </div>
        <div className='card__friend__name'>{friend.login}</div>
      </div>

      <div className='card__friend__menu'>
        <div id='card__friend__menu__body' className='card__friend__menu__body'
          style={{ height: isTableFriendUsersMenu ? '145px' : '0px', width: isTableFriendUsersMenu ? '80px' : '0px' }}>
          <button className='card__friend__menu__button'
            onClick={() => console.log('chamou', friend.login, 'pra um desafio')}
            data-html={true}
            data-tip={'Challenge'}>
            <Sword size={32} />
          </button>
          <button
            className='card__friend__menu__button'
            onClick={handleRemoveFriend}
            data-html={true}
            data-tip={'Remove Friend'}
          >
            <UserMinus size={32} />
          </button>

          <button className='card__friend__menu__button'
            onClick={handleBlockFriend}
            data-html={true}
            data-tip={'Block'}
          >
            <Prohibit size={32} />
          </button>

        </div>

        <DotsThreeVertical
          id='card__friend__menu'
          className='chat__friends__header__icon'
          size={40}
          onClick={() => setIsTableFriendUsersMenu(prev => !prev)}
          data-html={true}
          data-tip={'Menu'}
        />
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div>
    </div >
  );
}
