import './FriendTab.scss';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { UserData } from '../../../others/Interfaces/interfaces';
import { CardUser } from '../../CardUser/CardUser';

export function FriendTab() {

  const { globalData } = useContext(IntraDataContext);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='friend__tab' >
      <div
        className='friend__tab__header'>
        <ButtonSearch
          width={'70%'}
          tooltip={'Search Friend'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
      </div>
      <div className='friend__tab__body'>
        {globalData.friends.filter((obj: UserData) => obj.login.includes(searchInput))
          .map((obj: UserData) =>
            <CardUser key={Math.random()} user={obj} menuHeight={0}>
            </CardUser>)
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}
