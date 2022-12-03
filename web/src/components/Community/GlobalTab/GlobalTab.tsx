import './GlobalTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardUser } from '../../CardUser/CardUser';

interface CommunityUser {
  image_url: string;
  login: string;
  ratio: string;
}

export function GlobalTab() {
  const { api, config } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { data } = useQuery(
    'getCommunity',
    async () => {
      const response = await api.get('/user/getCommunity', config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div className='global__tab'>
      <div className='global__tab__header'>
        <div className='global__tab__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='global__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search User'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />

          <input
            className='global__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='global__tab__header__icon'
            size={40}
            onClick={() => {
              setSearchInput('');
            }}
          />
        </div>
      </div>
      <div className='global__tab__body'>
        {
          data && data
            .filter((obj: CommunityUser) => obj.login.includes(searchInput))
            .map((index: CommunityUser) => (
              <CardUser key={Math.random()} user={{ name: index.login, image: index.image_url }} menuHeight={0}>
                <span className='cardGlobal__ratio' > Ratio: {index.ratio}</span>
              </CardUser>
            ))}
      </div>
    </div >
  );
}