import './ChatTab.scss';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ChatData } from '../../../others/Interfaces/interfaces';
import { CardChat } from '../CardChat/CardChat';
import { ButtonSearch } from '../../Button/ButtonSearch';

interface ChatTabProps {
  tabSelected: string;
}

export function ChatTab({ tabSelected }: ChatTabProps) {

  const { globalData } = useContext(IntraDataContext);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='chat__tab'>
      <div className='chat__tab__header'
        style={{
          borderRadius:
            tabSelected === 'Direct' ? '0px 15px 15px 15px' : '15px 0px 15px 15px'
        }}>
        <ButtonSearch
          width={'100%'}
          tooltip={`Search ${tabSelected}`}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
      </div>
      < div className='chat__tab__body'>
        {tabSelected === 'Direct' ?
          globalData.directs.filter((obj: ChatData) => obj.name?.includes(searchInput))
            .map((obj: ChatData) => (
              <CardChat key={Math.random()} chat={obj} />
            ))
          :
          globalData.groups.filter((obj: ChatData) => obj.name?.includes(searchInput))
            .map((obj: ChatData) => (
              <CardChat key={Math.random()} chat={obj} />
            ))
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div>
  );
}