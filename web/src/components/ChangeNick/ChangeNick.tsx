import './ChangeNick.scss';
import axios from 'axios';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { PaperPlaneRight } from 'phosphor-react';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../status/statusState';

interface ChangeNickProps {
  setIsModalChangeNickVisible: (arg0: boolean) => void;
}

export function ChangeNick({ setIsModalChangeNickVisible }: ChangeNickProps) {

  const currentStateStatus = useSnapshot(stateStatus);
  const [nick, setNick] = useState<string>('');
  const [placeHolder, setPlaceHolder] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleChangeNick();
  }

  async function handleChangeNick() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const result = await axios.patch(
        `http://${import.meta.env.VITE_API_HOST}:3000/user/updateNick`,
        { nick: nick },
        config
      );

      if (result.status === 200) {
        setIsModalChangeNickVisible(false);
        currentStateStatus.socket?.emit('changeLogin', nick);
        setPlaceHolder('');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e && e.response) {
        if (e.response.data.statusCode === 403) {
          setPlaceHolder('Nick Unavaiable!');
        } else if (e.response.data.statusCode === 400) {
          setPlaceHolder('Need have min: 3, max: 15, forbidden: ');
        } else {
          setPlaceHolder('Invalid nick!');
        }
      }
    }
    setNick('');
    window.location.reload();
  }

  return (
    <Modal onClose={() => {
      setIsModalChangeNickVisible(false);
      setPlaceHolder('');
      setNick('');
    }}
    id={'modal__changeNick'}
    >
      <form className='change__nick__modal' onSubmit={handleKeyEnter}>
        <div className='change__nick__modal__textdiv'>
          <h3>Insert the new nick</h3>
          <input
            className='change__nick__modal__input'
            value={nick}
            placeholder={placeHolder}
            style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
            onChange={(msg) => {
              setNick(msg.target.value);
              setPlaceHolder('');
            }}
            ref={e => e?.focus()}
          />
        </div>
        <button className='change__nick__modal__button' type='submit'>
          <PaperPlaneRight size={30} />
        </button>
      </form>
    </Modal>
  );
}
