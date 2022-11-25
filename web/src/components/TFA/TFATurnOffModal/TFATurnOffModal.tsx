import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Modal } from '../../Modal/Modal';
import './TFATurnOffModal.scss';
interface TFATurnOffModalProps {
  setTfaModal: (arg0: string) => void;
  setTfaEnable: (arg0: boolean) => void;
}

export function TFATurnOffModal({
  setTfaModal,
  setTfaEnable,
}: TFATurnOffModalProps) {

  const { api, config } = useContext(IntraDataContext);

  async function handleTurnOff() {
    const body = {
      isTFAEnable: false,
      tfaValidated: false,
      tfaEmail: null,
      tfaCode: null,
    };
    const validateEmail = await api.patch('/user/turn-off-tfa', body, config);
    if (validateEmail.status === 200) {
      setTfaEnable(false);
      setTfaModal('');
      return;
    }
  }

  return (
    <Modal onClose={() => setTfaModal('')}>
      <h3 className='tfaTurnOff__title'> Are you sure you want to disable 2FA ?</h3>
      <div className='tfaTurnOff__buttons'>
        <button className='tfaTurnOff__button__confirm'
          onClick={handleTurnOff}>
          Confirm
        </button>
        <button className='tfaTurnOff__button__cancel'
          onClick={() => setTfaModal('')}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
