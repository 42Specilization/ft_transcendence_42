import './FriendsTab.scss';
import { DotsThreeVertical, MagnifyingGlass, UserPlus, X } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { DirectData } from '../../../Interfaces/interfaces';
import { CardBlocked } from './CardBlocked';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { CardFriend } from './CardFriend';
import { FriendRequestModal } from './FriendsRequestModal';


interface FriendTabProps {
  setActiveChat: Dispatch<SetStateAction<DirectData | null>>;
}

export function FriendTab({ setActiveChat }: FriendTabProps) {
  const { intraData } = useContext(IntraDataContext);

  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [isTableUsersMenu, setIsTableUsersMenu] = useState(false);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [isTableUsers, setIsTableUsers] = useState('friends');
  const [searchInput, setSearchInput] = useState('');

  // const [friendSelected, setFriendSelected]



  return (
    < div className='friends__tab' >
      <div className='friends__tab__header'>


        <div className='friends__tab__header__search'
          style={{ width: isTableSearch ? '100%' : '40px', padding: isTableSearch ? '10px' : '0px' }}>
          < MagnifyingGlass className='friends__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Friend'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
              setIsTableUsersMenu(false);
            }}
          />

          <input
            className='friends__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
          />
          <X
            className='friends__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>


        <UserPlus
          className={'friends__tab__header__icon' + (isTableSearch ? ' trasition__search' : '')}
          size={40}
          data-html={true}
          data-tip={'Add Friend'}
          onClick={() => setIsAddFriendModalVisible(true)}
        />


        <div
          className={'friends__tab__header__menu' + (isTableSearch ? ' trasition__search' : '')}
        >
          <DotsThreeVertical
            className={'friends__tab__header__icon' + (isTableSearch ? ' trasition__search' : '')}
            size={40}
            data-html={true}
            data-tip={'Menu'}
            onClick={() => setIsTableUsersMenu(prev => !prev)}
          />
          <div className='friends__tab__header__menu__body'
            style={{ height: isTableUsersMenu ? '90px' : '0px' }}>
            <button className='friends__tab__header__menu__button' onClick={() => {
              setIsTableUsers('friends');
              setIsTableUsersMenu(false);
            }
            }>Friends</button>
            <button className='friends__tab__header__menu__button'
              onClick={() => {
                setIsTableUsers('blocked');
                setIsTableUsersMenu(false);
              }
              }>Blocked</button>
          </div>
        </div>

        <ReactTooltip className='friends__tab__header__icon__tip' delayShow={50} />
      </div>
      <>{isTableUsers === 'friends' ?
        < div className='friends__tab__body'>
          {intraData.friends.filter((obj) => obj.login.includes(searchInput)).map((obj) => (
            <CardFriend key={Math.random()} friend={obj} setActiveChat={setActiveChat} />
          ))
          }
        </div>
        :
        <div className='friends__tab__body'>
          {intraData.blockeds.sort((a, b) => a.login < b.login ? -1 : 1).map((obj) => (
            <CardBlocked key={Math.random()} blocked={obj} />
          ))
          }
        </div>
      }
      </>
      {
        isAddFriendModalVisible &&
        <FriendRequestModal setIsAddFriendModalVisible={setIsAddFriendModalVisible} />
      }
    </div >);
}