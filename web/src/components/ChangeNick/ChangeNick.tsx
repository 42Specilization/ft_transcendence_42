import './ChangeNick.scss';
import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../../utils/utils';
import { Modal } from '../Modal/Modal';
interface ChangeNickProps {
  setIsModalChangeNickVisible: (arg0: boolean) => void;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function ChangeNick({
  setIsModalChangeNickVisible,
  setIntraData,
}: ChangeNickProps) {
  const [nick, setNick] = useState<string>('');
  const changeNickStyleDefault = {
    styles: {
      placeholder: 'Insert your nick...',
      border: '3px solid white',
    },
  };
  const [changeNickStyle, setChangeNickStyle] = useState(
    changeNickStyleDefault
  );

  async function handleChangeNick() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setChangeNickStyle(changeNickStyleDefault);

    try {
      const result = await axios.patch(
        `http://${import.meta.env.VITE_API_HOST}:3000/user/updateNick`,
        { nick: nick },
        config
      );
      if (result.status === 200) {
        setIsModalChangeNickVisible(false);
        window.localStorage.removeItem('userData');
        getStoredData(setIntraData);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const input = document.querySelector(
        '.changeNick__input'
      ) as HTMLInputElement;
      input.value = '';
      if (e && e.response) {
        const errorVefify = {
          styles: {
            placeholder: '',
            border: '3px solid red',
          },
        };
        if (e.response.data.statusCode === 403) {
          errorVefify.styles.placeholder = 'Nick Unavaiable';
        } else if (e.response.data.statusCode === 400) {
          errorVefify.styles.placeholder =
            'Nick need to have between 3 and 15 caracters';
        } else {
          errorVefify.styles.placeholder = 'Invalid nick';
        }
        setChangeNickStyle(errorVefify);
      }
    }
  }

  return (
    <Modal onClose={() => setIsModalChangeNickVisible(false)}>
      <div className="changeNick">
        <h3>Insert the new nick</h3>
        <input
          style={{ border: changeNickStyle.styles.border }}
          className="changeNick__input"
          placeholder={changeNickStyle.styles.placeholder}
          type="text"
          onChange={(e) => setNick(e.target.value)}
        />
        <button className="changeNick__button" onClick={handleChangeNick}>
          Change
        </button>
      </div>
    </Modal>
  );
}
