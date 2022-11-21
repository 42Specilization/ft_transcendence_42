import './GroupTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

export function GroupTab() {
  const { api, config } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [groups, setGroups] = useState<[]>([]);

  // useEffect(() => {
  //   async function getDirects() {
  //     const result = await api.get('/chat/getGroups', config);
  //     setGroups(result.data);
  //     console.log(result.data);
  //     return result;
  //   }
  //   getDirects();
  //   actionsChat.setChatList(setGroups);
  // }, [actionsChat]);

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
          groups.filter((obj:any) => obj.name?.includes(searchInput))
            .sort((a: any, b: any) => {
              if (a.date < b.date)
                return 1;
              return -1;
            })
            .map((obj) => (
              <p key={Math.random()}> 'group' </p>
            ))
        }
      </div>
    </div>
  );
}