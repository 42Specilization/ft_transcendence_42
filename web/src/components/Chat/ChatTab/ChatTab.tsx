import './ChatTab.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../others/Interfaces/interfaces';
import { CardChat } from '../CardChat/CardChat';

interface ChatTabProps {
  tabSelected: string;
}

export function ChatTab({ tabSelected }: ChatTabProps) {

  const { intraData } = useContext(IntraDataContext);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='chat__tab'>
      <div className='chat__tab__header'
        style={{
          borderRadius:
            tabSelected === 'Direct' ? '0px 15px 15px 15px' : '15px 0px 15px 15px'
        }}>
        <div className='chat__tab__header__search'
          style={{
            width: searchVisible ? '100%' : '40px',
            padding: searchVisible ? '10px' : '0px'
          }}>
          <MagnifyingGlass
            className='chat__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={`Search ${tabSelected}`}
            onClick={() => {
              setSearchVisible(prev => !prev);
              setSearchInput('');
            }}
          />
          <input
            className='chat__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (searchVisible) e?.focus(); }}
          />
          <X
            className='chat__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
      </div>
      < div className='chat__tab__body'>
        {tabSelected === 'Direct' ?
          intraData.directs &&
          intraData.directs.filter((obj: DirectData) => obj.name?.includes(searchInput))
            .map((obj: DirectData) => (
              <CardChat key={Math.random()} chat={obj} />
            ))
          :
          intraData.groups &&
          intraData.groups.filter((obj: DirectData) => obj.name?.includes(searchInput))
            .map((obj: DirectData) => (
              <CardChat key={Math.random()} chat={obj} />
            ))
        }
      </div>
      <ReactTooltip delayShow={50} />
    </div>
  );
}