import axios from 'axios';
import { useEffect, useState } from 'react';
import { TFATurnOffModal } from '../TFATurnOffModal/TFATurnOffModal';
import { TFATurnOnModal } from '../TFATurnOnModal/TFATurnOnModal';
import { TFAValidateCodeModal } from '../TFAValidateCodeModal/TFAValidateCodeModal';
import './TFAButton.scss';

export function TFAButton(){
  const [verifyCode, setVerifyCode] = useState<string>('');
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
    <div className="tfaButton">
      <strong>2FA Authentication</strong>
      {
        !tfaEnable ?
          <button onClick={()=> setIsModalTurnOnVisible(true)} className='tfaButton__button'>Turn On</button>:
          <button style={{backgroundColor:'red'}} onClick={()=>setIsModalTurnOffVisible(true)} className='tfaButton__button'>Turn Off</button>
      }
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
        setVerifyCode={setVerifyCode}
        setIsModalVerifyCodeVisible={setIsModalVerifyCodeVisible}
      />
      <TFAValidateCodeModal
        config={config}
        setIsModalVerifyCodeVisible={setIsModalVerifyCodeVisible}
        api={api}
        tfaEmail={tfaEmail}
        isModalVerifyCodeVisible={isModalVerifyCodeVisible}
        verifyCode={verifyCode}
        emailInput={emailInput}
      />
    </div>
  );
}
