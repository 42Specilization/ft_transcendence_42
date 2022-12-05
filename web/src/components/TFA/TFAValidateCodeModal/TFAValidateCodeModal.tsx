import './TFAValidateCodeModal.scss';
import { useContext, useState } from 'react';
import { Modal } from '../../Modal/Modal';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface TFAValidateCodeModalProps {
  tfaEmail: string;
  setTfaEmail: (arg0: string) => void;
  setTfaEnable: (arg0: boolean) => void;
  setTfaModal: (arg0: string) => void;
}

export function TFAValidateCodeModal({
  tfaEmail,
  setTfaEmail,
  setTfaModal,
  setTfaEnable,
}: TFAValidateCodeModalProps) {

  const { api, config } = useContext(IntraDataContext);
  const [code, setCode] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');

  async function turnOnTFA(body: any, config: any) {
    const updateTfa = await api.patch('/user/turn-on-tfa', body, config);
    if (updateTfa.status === 200) {
      setTfaModal('');
      setTfaEmail('');
      window.location.reload();
    }
  }

  async function handleValidateCode() {
    const body = {
      isTFAEnable: false,
      tfaCode: code,
      tfaValidated: false,
    };
    try {
      const validateCode = await api.patch('/user/validate-code', body, config);
      if (validateCode.status === 200) {
        body.tfaValidated = true;
        body.isTFAEnable= true;
        turnOnTFA(body, config);
      }
    } catch (err) {
      setPlaceHolder('Invalid Code');
    }
    setCode('');
  }

  async function handleCancel() {
    const body = {
      isTFAEnable: false,
      tfaValidated: false,
      tfaEmail: null,
      tfaCode: null,
    };
    const validateEmail = await api.patch('/user/turn-off-tfa', body, config);
    if (validateEmail.status === 200) {
      setTfaEnable(false);
    }
    setTfaModal('');
    setTfaEmail('');
  }

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleValidateCode();
  }

  return (
    <Modal onClose={() => handleCancel()}>
      <form className='tfaValidate__modal' onSubmit={handleKeyEnter}>
        <h3> Insert code received in:</h3>
        <h3> {tfaEmail} </h3>
        <input
          className='tfaValidate__modal__input'
          value={code}
          placeholder={placeHolder}
          style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
          onChange={(code) => {
            setCode(code.target.value);
            setPlaceHolder('');
          }}
          ref={e => e?.focus()}
        />
        <div className='tfaValidate__modal__buttons'>
          <button className='tfaValidate__modal__button__validate'
            onClick={handleValidateCode}>
            Validate
          </button>
          <button className='tfaValidate__modal__button__cancel'
            onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
