import './FriendTab.scss';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import ReactTooltip from 'react-tooltip';
import { actionsStatus } from '../../../adapters/status/statusState';
import { CardFriend } from './CardFriend/CardFriend';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { useQuery } from 'react-query';

export function FriendTab() {
  const { intraData } = useContext(IntraDataContext);

  const [searchActive, setSearchActive] = useState(false);
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
    <div className='friend__tab' >
      <div
        className='friend__tab__header'>
        <ButtonSearch
          width={'70%'}
          tooltip={'Search Friend'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
      </div>
      <div className='friend__tab__body'>
        {intraData.friends?.filter((obj) => obj.login.includes(searchInput))
          .map((obj) => <CardFriend key={Math.random()} friend={obj} />)
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}