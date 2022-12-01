import './BlockedTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { CardBlocked } from '../CardBlocked/CardBlocked';

export function BlockedTab() {
  const { intraData } = useContext(IntraDataContext);

  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    < div className='blocked__tab' >
      <div
        className='blocked__tab__header'>
        <div className='blocked__tab__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='blocked__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Blocked'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />
          <input
            className='blocked__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='blocked__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
        <ReactTooltip delayShow={50} />
      </div>
      <div className='blocked__tab__body'>
        {
          intraData.blocked?.sort((a, b) => a.login < b.login ? -1 : 1)
            .map((obj) => <CardBlocked key={Math.random()} blocked={obj} />)
        }
      </div>
    </div >);
}