import './BlockedTab.scss';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { CardUser } from '../../CardUser/CardUser';
import { ButtonSearch } from '../../Button/ButtonSearch';

export function BlockedTab() {

  const { intraData } = useContext(IntraDataContext);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='blocked__tab' >
      <div
        className='blocked__tab__header'>
        <ButtonSearch
          width={'70%'}
          tooltip={'Search Blocked'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
      </div>
      <div className='blocked__tab__body'>
        {
          intraData.blocked?.sort((a, b) => a.login < b.login ? -1 : 1)
            .map((obj) =>
              <CardUser key={Math.random()} user={obj} menuHeight={0}>
              </CardUser>)
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}