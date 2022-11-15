import axios from 'axios';
import { useEffect, useState } from 'react';
import { TFATurnOffModal } from '../TFATurnOffModal/TFATurnOffModal';
import { TFATurnOnModal } from '../TFATurnOnModal/TFATurnOnModal';
import { TFAValidateCodeModal } from '../TFAValidateCodeModal/TFAValidateCodeModal';
import { ToggleLeft, ToggleRight } from 'phosphor-react';
import './TFAButton.scss';

export function TFAButton(){
  const [tfaEmail, setTfaEmail] = useState<string>('');
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  const [isModalTurnOnVisible, setIsModalTurnOnVisible] = useState(false);
  const [isModalTurnOffVisible, setIsModalTurnOffVisible] = useState(false);

  const emailInput = document.querySelector('.tfaTurnOn__input') as HTMLInputElement;

  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  });

  const [tfaEnable, setTfaEnable] = useState<boolean>(false);
  async function checkTfa(){
    const user = await api.get('/user/me', config);
    if (user.data.isTFAEnable)
      setTfaEnable(true);
    else
      setTfaEnable(false);
  }

  useEffect( ()=> {
    checkTfa();
  }, []);

  return (
    <div className='tfaButton'>
      <strong>2FA Authentication</strong>
      <button className='tfaButton__button'
        style={{backgroundColor: tfaEnable ? 'green' : 'red'}}
        onClick={()=> {
          if (tfaEnable)
            setIsModalTurnOffVisible(true);
          else
            setIsModalTurnOnVisible(true);
        }}>
        {tfaEnable ? <ToggleRight size={50}/> : <ToggleLeft size={50}/>}
      </button>
      <TFATurnOffModal
        setTfaEnable={setTfaEnable}
        isModalTurnOffVisible={isModalTurnOffVisible}
        setIsModalTurnOffVisible={setIsModalTurnOffVisible}
        api={api}
        config={config}
      />
      <TFATurnOnModal
        config={config}
        setIsModalTurnOnVisible={setIsModalTurnOnVisible}
        isModalTurnOnVisible={isModalTurnOnVisible}
        setTfaEmail={setTfaEmail}
        tfaEmail={tfaEmail}
        api={api}
        emailInput={emailInput}
        setIsModalVerifyCodeVisible={setIsModalVerifyCodeVisible}
      />
      <TFAValidateCodeModal
        config={config}
        setTfaEnable={setTfaEnable}
        setIsModalVerifyCodeVisible={setIsModalVerifyCodeVisible}
        api={api}
        tfaEmail={tfaEmail}
        isModalVerifyCodeVisible={isModalVerifyCodeVisible}
        emailInput={emailInput}
      />
    </div>
  );
}
