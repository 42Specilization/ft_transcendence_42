import './GlobalTab.scss';

import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardUser } from '../../CardUser/CardUser';
import { ButtonSearch } from '../../Button/ButtonSearch';

interface CommunityUser {
  image_url: string;
  login: string;
  ratio: string;
}

export function GlobalTab() {
  const { api, config } = useContext(IntraDataContext);
  const [searchActive, setSearchActive] = useState(false);
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
        <ButtonSearch
          width={'70%'}
          tooltip={'Search User'}
          padding={'0px'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
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