
import './ProfileCard.scss';
import { UserImage } from './UserImage';
import { NotePencil } from 'phosphor-react';
import { TFAButton } from '../../TFA/TFAButton/TFAButton';
import { ChangeNick } from '../../ChangeNick/ChangeNick';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface ProfileCardProps {

}

export function ProfileCard({}: ProfileCardProps) {
  const { intraData } = useContext(IntraDataContext);
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
