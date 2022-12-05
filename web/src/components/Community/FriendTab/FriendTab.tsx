import './FriendTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { CardFriend } from '../CardFriend/CardFriend';
import { useQuery } from 'react-query';

export function FriendTab() {
  const { intraData } = useContext(IntraDataContext);

  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useQuery(
    ['getStatus', intraData],
    async () => {
      actionsStatus.whoIsOnline();
      actionsStatus.whoIsInGame();
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );





  return (
    < div className='friend__tab' >
      <div
        className='friend__tab__header'>
        <div className='friend__tab__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='friend__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Friend'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
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
        <ReactTooltip delayShow={50} />
      </div>
      < div className='friend__tab__body'>
        {intraData.friends?.filter((obj) => obj.login.includes(searchInput))
          .map((obj) => <CardFriend key={Math.random()} friend={obj} />)
        }
      </div>
    </div >);
}