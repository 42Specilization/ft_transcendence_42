import './Community.scss';
import { useState } from 'react';
import { GlobalTab } from '../../components/Community/GlobalTab/GlobalTab';
import { FriendTab } from '../../components/Community/FriendTab/FriendTab';
import { BlockedTab } from '../../components/Community/BlockedTab/BlockedTab';
import { GroupsTab } from '../../components/Community/GroupsTab/GroupsTab';



export default function Community() {

  const [tableSelected, setTableSelected] = useState('Groups');

  return (
    <div className='body'>
      <nav className='community__header'>
        <ul className='community__header__list'>
          <li className={`community__header__list__item
        ${tableSelected === 'Friends' ?
      'community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Friends')}>
              Friends
            </button>
          </li>
          <li className={`community__header__list__item
        ${tableSelected === 'Global' ?
      'community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Global')}>
              Global
            </button>
          </li>
          <li className={`community__header__list__item
        ${tableSelected === 'Groups' ?
      'community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Groups')}>
              Groups
            </button>
          </li>
          <li className={`community__header__list__item
      ${tableSelected === 'Blockeds' ?
      'community__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Blockeds')}>
              Blockeds
            </button>
          </li>
        </ul>
      </nav>
      <div className='community__body'>
        {(() => {
          if (tableSelected === 'Friends')
            return <FriendTab />;
          if (tableSelected === 'Global')
            return <GlobalTab />;
          if (tableSelected === 'Groups')
            return <GroupsTab />;
          if (tableSelected === 'Blockeds')
            return <BlockedTab />;
        })()}
      </div>
    </div >
  );
}
