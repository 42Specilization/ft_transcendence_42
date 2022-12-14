/* eslint-disable indent */
import './Profile.scss';
import { useContext, useEffect, useState } from 'react';
import { ProfileGeneral } from '../../components/Profile/ProfileGeneral/ProfileGeneral';
import { ProfileHistoric } from '../../components/Profile/ProfileHistoric/ProfileHistoric';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function Profile() {
  const [tableSelected, setTableSelected] = useState('General');

  const { exitActiveChat } = useContext(GlobalContext);
  const { activeChat } = useContext(ChatContext);

  useEffect(() => {
    if (activeChat)
      exitActiveChat();
  }, []);

  return (
    <div className='body'>
      <nav className='profile__header'>
        <ul className='profile__header__list'>
          <li className={`profile__header__list__item
          ${tableSelected === 'General' ?
              'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('General')}>
              General
            </button>
          </li>
          <li className={`profile__header__list__item
          ${tableSelected === 'Historic' ?
              'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Historic')}>
              Historic
            </button>
          </li>
        </ul>
      </nav>
      <div className='profile__body'>
        {(() => {
          if (tableSelected === 'General')
            return <ProfileGeneral />;
          if (tableSelected === 'Historic')
            return <ProfileHistoric />;
        })()}
      </div>
    </div >
  );
}
