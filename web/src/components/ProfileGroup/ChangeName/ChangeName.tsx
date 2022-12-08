import './ChangeName.scss';
import { useContext, useState } from 'react';
import { PaperPlaneRight } from 'phosphor-react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Modal } from '../../Modal/Modal';
import { actionsStatus } from '../../../adapters/status/statusState';

interface ChangeNameProps {
  id: string | undefined;
  setModalChangeName: (arg0: boolean) => void;
}

export function ChangeName({ id, setModalChangeName }: ChangeNameProps) {
  const { api, config } = useContext(GlobalContext);
  const [name, setName] = useState<string>('');
  const [placeHolder, setPlaceHolder] = useState('');

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleChangeName();
  }

  async function handleChangeName() {
    try {
      const result = await api.patch('/chat/updateGroup', { id: id, name: name }, config);
      if (result.status === 200) {
        actionsStatus.changeGroupName(id as string, name);
        setModalChangeName(false);
        setPlaceHolder('');
      }
    } catch (e: any) {
      if (e && e.response) {
        setPlaceHolder('Error');
      }
    }
    setName('');
  }

  return (
    <Modal id='changeName__modal' onClose={() => setModalChangeName(false)}>
      <form className='changeName__modal' onSubmit={handleKeyEnter}>
        <h3>Insert the new nick</h3>
        <div className='changeName__modal__text__div'>
          <input
            className='changeName__modal__input'
            value={name}
            placeholder={placeHolder}
            style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
            onChange={(msg) => {
              setName(msg.target.value);
              setPlaceHolder('');
            }}
            ref={e => e?.focus()}
          />
          <button className='changeName__modal__button' type='submit'>
            <PaperPlaneRight size={30} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
