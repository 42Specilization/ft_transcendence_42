import { MagnifyingGlass, X } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { DirectData } from '../../../Interfaces/interfaces';
import { CardDirect } from './CardDirect';
import './DirectTab.scss';

interface DirectTabProps {
  setActiveChat: Dispatch<SetStateAction<DirectData | null>>;
}

export function DirectTab({ setActiveChat }: DirectTabProps) {
  const { intraData, api } = useContext(IntraDataContext);

  const [isTableSearch, setIsTableSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [directs, setDirects] = useState<DirectData[]>([]);

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    };
  }, []);

  useEffect(() => {
    async function getDirects() {
      const result = await api.get('/chat/getDirects', config);
      setDirects(result.data);
      return result;
    }
    getDirects();
  }, []);


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
            .map((obj) => (
              <CardDirect key={Math.random()} chat={obj} setActiveChat={setActiveChat} />
            ))
        }
      </div>
    </div>
  );
}