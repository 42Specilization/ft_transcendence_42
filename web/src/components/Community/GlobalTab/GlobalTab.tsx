import './GlobalTab.scss';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardUser } from '../../CardUser/CardUser';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { UserData } from '../../../others/Interfaces/interfaces';

export function GlobalTab() {
  const { globalData } = useContext(IntraDataContext);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='global__tab'>
      <div className='global__tab__header'>
        <ButtonSearch
          width={'70%'}
          tooltip={'Search User'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
      </div>
      <div className='global__tab__body'>
        {globalData.globalUsers.filter((obj: UserData) => obj.login.includes(searchInput))
          .map((obj: UserData) => (
            <CardUser key={Math.random()} user={obj} menuHeight={0}>
              <span className='global__tab__ratio' > Ratio: {obj.ratio}</span>
            </CardUser>
          ))}
      </div>
    </div >
  );
}