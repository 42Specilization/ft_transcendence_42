import './GroupsTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function GroupsTab() {

  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    < div className='groups__tab' >
      <div
        className='groups__tab__header'>
        <div className='groups__tab__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='groups__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Blocked'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />
          <input
            className='groups__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='groups__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
        <ReactTooltip delayShow={50} />
      </div>
      <div className='groups__tab__body'>
        {/* {
          intraData.blockeds?.sort((a, b) => a.login < b.login ? -1 : 1)
            .map((obj) => <CardBlocked key={Math.random()} blocked={obj} />)
        } */}
      </div>
    </div >);
}