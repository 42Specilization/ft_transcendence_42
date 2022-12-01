import './ChangeNick.scss';
import { useContext, useState } from 'react';
import { Modal } from '../../Modal/Modal';
import { PaperPlaneRight } from 'phosphor-react';
import { actionsStatus } from '../../../adapters/status/statusState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';


interface ChangeNickProps {
  setIsModalChangeNickVisible: (arg0: boolean) => void;
}

export function ChangeNick({ setIsModalChangeNickVisible }: ChangeNickProps) {

  const { api, config } = useContext(IntraDataContext);
  const [nick, setNick] = useState<string>('');
  const [placeHolder, setPlaceHolder] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleChangeNick();
  }

  async function handleChangeNick() {
    try {
      const result = await api.patch('/user/updateNick', { nick: nick }, config);

      if (result.status === 200) {
        setIsModalChangeNickVisible(false);
        actionsStatus.changeLogin(nick);
        setPlaceHolder('');
      }
    } catch (e: any) {
      if (e && e.response) {
        if (e.response.data.statusCode === 403) {
          setPlaceHolder('Nick Unavailable!');
        } else if (e.response.data.statusCode === 400) {
          setPlaceHolder('Need have min: 3, max: 15, forbidden: ');
        } else {
          setPlaceHolder('Invalid nick!');
        }
      }
    }
    setNick('');
  }

  return (
    <Modal id='modal__changeNick'
      onClose={() => { setIsModalChangeNickVisible(false); }}
    >
      <form className='change__nick__modal' onSubmit={handleKeyEnter}>
        <div className='change__nick__modal__text__div'>
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
