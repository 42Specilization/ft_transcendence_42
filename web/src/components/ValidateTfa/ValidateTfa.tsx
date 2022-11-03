import './ValidateTfa.scss';
import {  useState } from 'react';
import { Modal } from '../Modal/Modal';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

export function ValidateTfa() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  });

  const verifyCodeStyleDefault = {
    styles: {
      placeholder: 'Insert Code...',
      border: '3px solid black'
    },
  };

  const [verifyCode, setVerifyCode] = useState<string>('');
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalRequestMailVisible, setIsModalRequestMailVisible] = useState(true);
  const [verifyCodeStyle, setVerifyCodeStyle] = useState(verifyCodeStyleDefault);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      // console.log(updateTfa);
      setIsModalVerifyCodeVisible(false);
    }
  }

  async function sendEmail() {
    const user = await api.get('/user/me', config);
    const body = {
      isTFAEnable: true,
      tfaEmail: user.data.tfaEmail,
      tfaValidated: true,
    };
    setIsLoading(true);
    const validateEmail = await api.patch('/user/validate-email', body, config);
    setIsLoading(false);
    // Deixar esse print para ver os codigos enviados
    console.log(validateEmail);
    setVerifyCode(validateEmail.data);
    setIsModalVerifyCodeVisible(true);
    setIsModalRequestMailVisible(false);
  }

  async function handleValidateCode(){
    const user = await api.get('/user/me', config);
    const body = {
      isTFAEnable: true,
      tfaEmail: user.data.tfaEmail,
      tfaValidated: true,
    };
    const typedCode = document.querySelector('.tfaVerifyModal__input') as HTMLInputElement;
    console.log(typedCode.value.toString());

    if ( typedCode.value.length === 6 && typedCode.value.toString() === verifyCode.toString()){
      setVerifyCodeStyle(verifyCodeStyleDefault);
      typedCode.value = '';
      turnOnTFA(body, config);
      window.location.reload();
    }
    else {
      typedCode.value = '';
      const errorVefify = {
        styles: {
          placeholder: 'Invalid Code',
          border: '3px solid red'
        },
      };
      setVerifyCodeStyle(errorVefify);
    }
  }

  return (
    <div className="validateTfa">
      {
        isModalRequestMailVisible ?
          <Modal
            id='tfaRequestModal'
          >
            <div className='tfaRequestModal__requestArea'>
              <h3>Click to request a new code</h3>
              <button
                className='tfaRequestModal__buttonRequest'
                onClick={sendEmail}>
                Send Code
              </button>
            </div>
            {
              isLoading ?
                <div className='tfaRequestModal__loading'>
                  <strong>Wait a moment...</strong>
                  <TailSpin
                    width='30'
                    height='30'
                    color='purple'
                    ariaLabel='loading'
                  />
                </div> : null
            }
          </Modal>: null
      }
      {
        isModalVerifyCodeVisible ?
          <Modal id='tfaVerifyModal'>
            <div className='tfaVerifyModal__inputArea' >
              <h3>Insert received code</h3>
              <input
                style={{border:verifyCodeStyle.styles.border}}
                className='tfaVerifyModal__input' type="text"
                placeholder={verifyCodeStyle.styles.placeholder}
              />
              <button
                className='tfaVerifyModal__button'
                onClick={handleValidateCode}>
                Validate
              </button>
              <button
                className='tfaVerifyModal__buttonRecovery'
                onClick={sendEmail}>
                  Dont receive? Click to request again
              </button>
              {
                isLoading ?
                  <div className="tfaVerify_recovery">
                    <div className='tfaVerify__loading'>
                      <strong>Wait a moment...</strong>
                      <TailSpin
                        width='30'
                        height='30'
                        color='purple'
                        ariaLabel='loading'
                      />
                    </div>
                  </div> : null
              }
            </div>
          </Modal> : null
      }
    </div >
  );
}
