import './Community.scss';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { MagnifyingGlass, X } from 'phosphor-react';
import { CardCommunity } from './CardCommunity/CardCommunity';

interface CommunityUser {
  image_url: string;
  login: string;
  ratio: string;
}

export function Community() {
  const { api, config } = useContext(IntraDataContext);
  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { data } = useQuery(
    'getCommunity',
    async () => {
      const response = await api.get('/user/getCommunty', config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div className='community'>
      <div className='community__header'>
        <div className='community__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='community__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search User'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />

          <input
            className='community__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='community__header__icon'
            size={40}
            onClick={() => {
              setIsTableSearch(false);
              setSearchInput('');
            }}
          />
        </div>
      </div>
      <div className='community__body'>
        {
          data && data
            .filter((obj: CommunityUser) => obj.login.includes(searchInput))
            .map((index: CommunityUser) => (
              <CardCommunity
                key={crypto.randomUUID()}
                image_url={index.image_url}
                login={index.login}
                ratio={index.ratio}
              />
            ))}
      </div>
    </div >
  );
}
