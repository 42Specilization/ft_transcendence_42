import './Button.scss';
import { Prohibit } from 'phosphor-react';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { ConfirmActionModal } from '../ConfirmActionModal/ConfirmActionModal';
import { actionsStatus } from '../../adapters/status/statusState';

interface ButtonBlockUserProps {
  login: string;
  image: string;
}

export function ButtonBlockUser({ login, image }: ButtonBlockUserProps) {

  const { api, config, setIntraData } = useContext(IntraDataContext);
  const [confirmActionVisible, setConfirmActionVisible] = useState(false);

  async function handleBlockFriend() {
    await api.patch('/user/addBlocked', { nick: login }, config);
    await api.patch('/chat/deleteDirect', { friend_login: login }, config);

    setIntraData((prev) => {
      if (login && image)
        prev.blocked.push({ login: login, image_url: image });
      return {
        ...prev,
        directs: prev.directs.filter((key) => key.name != login),
        friends: prev.friends.filter((key) => key.login != login),
      };
    });
    if (login)
      actionsStatus.blockFriend(login);
  }

  return (
    <>
      <button className='button__icon'
        onClick={() => setConfirmActionVisible(true)}
        data-html={true}
        data-tip={'Block User'}
      >
        <Prohibit size={32} />
      </button>
      {confirmActionVisible &&
        <ConfirmActionModal
          title={'Block user?'}
          onClose={() => setConfirmActionVisible(false)}
          confirmationFunction={handleBlockFriend}
        />
      }
    </>
  );
}