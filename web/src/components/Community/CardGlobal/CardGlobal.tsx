import './CardGlobal.scss';
import { useState } from 'react';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
import { getUrlImage } from '../../../others/utils/utils';

interface CardGlobalProps {
  image_url: string;
  login: string;
  ratio: string;
}

export function CardGlobal({ image_url, login, ratio }: CardGlobalProps) {
  const [friendProfileVisible, setProfileUserVisible] = useState(false);

  function selectAction(e: any) {
    if (e.target.id === 'cardGlobal') {
      setProfileUserVisible((prev) => !prev);
    }
  }

  return (
    <div id='cardGlobal' className='cardGlobal'
      onClick={(e) => selectAction(e)}
    >
      <div id='cardGlobal' className='cardGlobal__icon'
        style={{ backgroundImage: `url(${getUrlImage(image_url)})` }}>
      </div>

      <div id='cardGlobal' className='cardGlobal__name'>{login}</div>
      <span className='cardGlobal__ratio' > Ratio: {ratio}</span>
      {friendProfileVisible &&
        <ProfileUserModal
          login={login}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </div >
  );
}
