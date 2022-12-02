import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { FriendProfileGeneral } from '../../components/FriendProfile/FriendProfileGeneral/FriendProfileGeneral';
import { FriendProfileHistoric } from '../../components/FriendProfile/FriendProfileHistoric/FriendProfileHistoric';
import './FriendProfile.scss';
import { IntraDataContext } from '../../contexts/IntraDataContext';
interface FriendProfileProps {
  login: string | undefined;
}

export function FriendProfile({ login }: FriendProfileProps) {

  const [tableSelected, setTableSelected] = useState('General');
  const { api, config } = useContext(IntraDataContext);

  const { data, status } = useQuery(
    ['friend'],
    async () => {
      const response = await api.patch('/user/friend', { nick: login }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );
  console.log(data);

  if (status == 'loading')
    return <></>;

  return (
    <>
      <nav className='friendProfile__header'>
        <ul className='friendProfile__header__list'>
          <li className={`friendProfile__header__list__item
          ${tableSelected === 'General' ?
      'friendProfile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('General')}>
              General
            </button>
          </li>
          <li className={`friendProfile__header__list__item
          ${tableSelected === 'Historic' ?
      'friendProfile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Historic')}>
              Historic
            </button>
          </li>
        </ul>
      </nav>
      <div className='friendProfile__body'>
        {(() => {
          if (tableSelected === 'General')
            return <FriendProfileGeneral friendData={data} />;
          if (tableSelected === 'Historic')
            return <FriendProfileHistoric friendData={data} />;

        })()}
      </div>
    </>
  );
}
