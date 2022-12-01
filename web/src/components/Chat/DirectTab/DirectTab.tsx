import './DirectTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import { CardDirect } from '../CardDirect/CardDirect';

export function DirectTab() {
  const { intraData } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    < div className='direct__tab' >
      <div className='direct__tab__header'>
        <div className='direct__tab__header__search'
          style={{ width: isTableSearch ? '100%' : '40px', padding: isTableSearch ? '10px' : '0px' }}>
          < MagnifyingGlass
            className='direct__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Direct'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />
          <ReactTooltip delayShow={50} />
          <input
            className='direct__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='direct__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
      </div>
      < div className='direct__tab__body'>
        {
          intraData.directs.filter((obj: DirectData) => obj.name?.includes(searchInput))
            .map((obj: DirectData) => (
              <CardDirect key={Math.random()} chat={obj} />
            ))
        }
      </div>
    </div>
  );
}