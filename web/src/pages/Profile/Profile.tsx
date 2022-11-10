import './Profile.scss';
import { useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import React from 'react';
import { defaultIntra, getStoredData } from '../../utils/utils';
import ProfileGeneral from '../../components/Profile/ProfileGeneral/ProfileGeneral';
import ProfileHistoric from '../../components/Profile/ProfileHistoric/ProfileHistoric';
import ProfileAchiviements from '../../components/Profile/ProfileAchiviements/ProfileAchiviements';


export default function Profile() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

  useEffect(() => {
    window.localStorage.removeItem('userData');
    getStoredData(setIntraData);
  }, []);

  const [tableSelected, setTableSelected] = useState('General');

  return (
    <div className='body'>
      <nav className='profile__header'>
        <ul className='profile__header__list'>
          <li className={`profile__header__list__item ${tableSelected === 'General' ? 'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('General')}>
              General
            </button>
          </li>
          <li className={`profile__header__list__item ${tableSelected === 'Historic' ? 'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Historic')}>
              Historic
            </button>
          </li>
          <li className={`profile__header__list__item ${tableSelected === 'Achiviements' ? 'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Achiviements')}>
              Achiviements
            </button>
          </li>
        </ul>
      </nav>
      <div className='profile__body'>
        {(() => {
          if (tableSelected === 'General')
            return <ProfileGeneral intraData={intraData} setIntraData={setIntraData} />;
          else if (tableSelected === 'Historic')
            return <ProfileHistoric intraData={intraData} />;
          else
            return <ProfileAchiviements />;
        })()}
      </div>
    </div >
  );
}
