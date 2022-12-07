import './ProfileCard.scss';
import { UserImage } from '../UserImage/UserImage';
import { NotePencil } from 'phosphor-react';
import { TFAButton } from '../../TFA/TFAButton/TFAButton';
import { ChangeNick } from '../ChangeNick/ChangeNick';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

export function ProfileCard() {
  const { intraData } = useContext(GlobalContext);
  const [isModalChangeNickVisible, setIsModalChangeNickVisible] = useState(false);


  return (
    <div className='profileCard'>
      <UserImage />
      <strong className='profileCard__infos'>{intraData.usual_full_name}</strong>
      <strong className='profileCard__infos'>{intraData.email}</strong>
      <div className='profileCard__infos__nick'>
        <strong>{intraData.login}</strong>
        <div className='profileCard__infos__button'>
          <NotePencil
            size={32}
            onClick={() => setIsModalChangeNickVisible(true)}
          />
        </div>
        {isModalChangeNickVisible &&
          <ChangeNick
            setIsModalChangeNickVisible={setIsModalChangeNickVisible}
          />
        }
      </div>
      <TFAButton />
    </div >
  );
}
