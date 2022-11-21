import './FriendTab.scss';
import { DotsThreeVertical, MagnifyingGlass, UserPlus, X } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { CardFriend } from '../CardFriend/CardFriend';
import { CardBlocked } from '../CardBlocked/CardBlocked';
import { FriendRequestModal } from '../FriendsRequestModal/FriendsRequestModal';

interface FriendTabProps {
  setTableSelected: Dispatch<SetStateAction<string>>;
}

export function FriendTab(
  { setTableSelected }: FriendTabProps
) {
  const { intraData } = useContext(IntraDataContext);

  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [isTableUsersMenu, setIsTableUsersMenu] = useState(false);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [isTableUsers, setIsTableUsers] = useState('friend');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    actionsStatus.whoIsOnline();
  }, []);

  return (
    < div className='friend__tab' >
      <div className='friend__tab__header'>


        <div className='friend__tab__header__search'
          style={{ width: isTableSearch ? '100%' : '40px', padding: isTableSearch ? '10px' : '0px' }}>
          < MagnifyingGlass className='friend__tab__header__icon'
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
            className='friend__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='friend__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>


        <UserPlus
          className={'friend__tab__header__icon' + (isTableSearch ? ' trasition__search' : '')}
          size={40}
          data-html={true}
          data-tip={'Add Friend'}
          onClick={() => setIsAddFriendModalVisible(true)}
        />


        <div
          className={'friend__tab__header__menu' + (isTableSearch ? ' trasition__search' : '')}
        >
          <DotsThreeVertical
            className={'friend__tab__header__icon' + (isTableSearch ? ' trasition__search' : '')}
            size={40}
            data-html={true}
            data-tip={'Menu'}
            onClick={() => setIsTableUsersMenu(prev => !prev)}
          />
          <div className='friend__tab__header__menu__body'
            style={{ height: isTableUsersMenu ? '90px' : '0px' }}>
            <button className='friend__tab__header__menu__button' onClick={() => {
              setIsTableUsers('friend');
              setIsTableUsersMenu(false);
            }
            }>Friends</button>
            <button className='friend__tab__header__menu__button'
              onClick={() => {
                setIsTableUsers('blocked');
                setIsTableUsersMenu(false);
              }
              }>Blocked</button>
          </div>
        </div>

        <ReactTooltip delayShow={50} />
      </div>
      <>{isTableUsers === 'friend' ?
        < div className='friend__tab__body'>
          {intraData.friends?.filter((obj) => obj.login.includes(searchInput)).map((obj) => (
            <CardFriend key={Math.random()} friend={obj} setTableSelected={setTableSelected} />
          ))
          }
        </div>
        :
        <div className='friend__tab__body'>
          {intraData.blockeds?.sort((a, b) => a.login < b.login ? -1 : 1).map((obj) => (
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