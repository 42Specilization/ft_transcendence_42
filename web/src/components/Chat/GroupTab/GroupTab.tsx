import './GroupTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { GroupData } from '../../../others/Interfaces/interfaces';
import { CardGroup } from '../CardGroup/CardGroup';

export function GroupTab() {
  const { intraData } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    < div className='group__tab' >
      <div className='group__tab__header'>

        <div className='group__tab__header__search'
          style={{ width: isTableSearch ? '100%' : '40px', padding: isTableSearch ? '10px' : '0px' }}>

          < MagnifyingGlass
            className='group__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Gropu'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />
          <ReactTooltip delayShow={50} />
          <input
            className='group__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='group__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>

      </div>
      < div className='group__tab__body'>
        {
          intraData.groups.filter((obj: GroupData) => obj.name?.includes(searchInput))
            .map((obj: GroupData) => (
              <CardGroup key={crypto.randomUUID()} chat={obj} />
            ))
        }
      </div>
    </div>
  );
}