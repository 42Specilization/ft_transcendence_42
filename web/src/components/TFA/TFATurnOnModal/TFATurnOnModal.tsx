import { PaperPlaneRight } from 'phosphor-react';
import { useContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Modal } from '../../Modal/Modal';
import './TFATurnOnModal.scss';

interface TFATurnOnModalProps {
  tfaEmail: string;
  setTfaEmail: (arg0: string) => void
  setTfaModal: (arg0: string) => void
}

export function TFATurnOnModal({
  tfaEmail,
  setTfaEmail,
  setTfaModal }: TFATurnOnModalProps) {

  const { api, config } = useContext(IntraDataContext);
  const [placeHolder, setPlaceHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleTFA() {
    const body = {
      isTFAEnable: true,
      tfaEmail: tfaEmail,
      tfaValidated: false,
    };
    try {
      setIsLoading(true);
      const validateEmail = await api.patch('/user/validate-email', body, config);
      setIsLoading(false);
      if (validateEmail.status === 200)
        setTfaModal('TFAValidate');
    } catch (error) {
      setIsLoading(false);
      setTfaEmail('');
      setPlaceHolder('Invalid Mail');
    }
  }

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleTFA();
  }

  return (
    <Modal onClose={() => {
      setTfaModal('');
      setTfaEmail('');
    }}>
      <form className='tfaTurnOn__modal' onSubmit={handleKeyEnter}>
        <div className='tfaTurnOn__modal__text__div'>
          <h3>Insert your email to receive 2FA code</h3>
          <input
            className='tfaTurnOn__modal__input'
            value={tfaEmail}
            placeholder={placeHolder}
            style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
            onChange={(tfaEmail) => {
              setTfaEmail(tfaEmail.target.value);
              setPlaceHolder('');
            }}
            ref={e => e?.focus()}
          />
        </div>
        <button className='tfaTurnOn__modal__button' type='submit'>
          <PaperPlaneRight size={30} />
        </button>
      </form>
      <div className='tfaTurnOn__modal__loading'>
        <div className='tfaTurnOn__modal__loading__div'
          style={{ display: isLoading ? '' : 'none' }}>
          <strong>Wait a moment</strong>
          <TailSpin width='25' height='25' color='white' ariaLabel='loading' />
        </div>
      </div>
    </Modal>
  );
}
