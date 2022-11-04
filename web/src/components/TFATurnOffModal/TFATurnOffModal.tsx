import { AxiosInstance } from 'axios';
import { Modal } from '../Modal/Modal';
import './TFATurnOffModal.scss';
interface TFATurnOffModalProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  setIsModalTurnOffVisible: (arg0: boolean) => void;
  isModalTurnOffVisible: boolean;
  setTfaEnable:(arg0:boolean) => void;
  api: AxiosInstance;
}

export function TFATurnOffModal({
  setIsModalTurnOffVisible,
  isModalTurnOffVisible,
  setTfaEnable,
  api,
  config,

} : TFATurnOffModalProps){

  async function handleTurnOff(){
    const body = {
      isTFAEnable: false,
      tfaValidated: false,
      tfaEmail: null,
      tfaCode: null,
    };
    const validateEmail = await api.patch('/user/turn-off-tfa', body, config);
    if (validateEmail.status === 200){
      setTfaEnable(false);
      setIsModalTurnOffVisible(false);
      return ;
    }
  }

  return (
    <>
      {
        isModalTurnOffVisible ?
          <Modal
            onClose={() => setIsModalTurnOffVisible(false)}>
            <h3> Are you sure you want to disable 2fa ?</h3>
            <div className="tfaTurnOff__buttons">
              <button className="tfaTurnOff__button__confirm" onClick={handleTurnOff}>Confirm</button>
              <button className="tfaTurnOff__button__cancel" onClick={()=> setIsModalTurnOffVisible(false)}>Cancel</button>
            </div>
          </Modal> : null
      }
    </>
  );
}
