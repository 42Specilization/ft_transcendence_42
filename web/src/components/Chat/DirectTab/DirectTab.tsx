import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../Interfaces/interfaces';
import { CardDirect } from './CardDirect';
import './DirectTab.scss';

export function DirectTab() {
  const { api, config } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [directs, setDirects] = useState<DirectData[] | []>([]);

  useEffect(() => {
    async function getDirects() {
      const result = await api.get('/chat/getDirects', config);
      setDirects(result.data);
      console.log(result.data);
      return result;
    }
    getDirects();
    actionsChat.setChatList(setDirects);
  }, [actionsChat]);

  return (
    < div className='directs__tab' >
      <div className='directs__tab__header'>
        <div className='friends__tab__header__search'
          style={{ width: isTableSearch ? '100%' : '40px', padding: isTableSearch ? '10px' : '0px' }}>
          < MagnifyingGlass
            className='friends__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Friend'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />

          <input
            className='friends__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='friends__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
      </div>
      < div className='directs__tab__body'>
        {
          directs.filter((obj) => obj.name?.includes(searchInput))
            .sort((a: DirectData, b: DirectData) => {
              if (a.date < b.date)
                return 1;
              return -1;
            })
            .map((obj) => (
              <CardDirect key={Math.random()} chat={obj} />
            ))
        }
      </div>
    </div>
  );
}