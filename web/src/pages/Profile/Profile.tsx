import './Profile.scss';
import { Dispatch, SetStateAction, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import ProfileGeneral from '../../components/Profile/ProfileGeneral/ProfileGeneral';
import ProfileHistoric from '../../components/Profile/ProfileHistoric/ProfileHistoric';
import ProfileAchiviements from '../../components/Profile/ProfileAchiviements/ProfileAchiviements';

interface ProfileProps {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  currentStateStatus: any;
}

export default function Profile({ intraData, setIntraData, currentStateStatus }: ProfileProps) {

  const [tableSelected, setTableSelected] = useState('General');

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
          <li className={`profile__header__list__item
          ${tableSelected === 'Achiviements' ?
          'profile__header__list__item__selected' : ''}`}>
            <button onClick={() => setTableSelected('Achiviements')}>
              Achiviements
            </button>
          </li>
        </ul>
      </nav>
      <div className='profile__body'>
        {(() => {
          if (tableSelected === 'General')
            return <ProfileGeneral
                      intraData={intraData}
                      setIntraData={setIntraData}
                      currentStateStatus={currentStateStatus}/>;
          if (tableSelected === 'Historic')
            return <ProfileHistoric intraData={intraData} />;
          if (tableSelected === 'Achiviements')
            return <ProfileAchiviements />;
        })()}
      </div>
    </div >
  );
}
