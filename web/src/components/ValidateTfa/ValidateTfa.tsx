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
  const [verifyCodeStyle, setVerifyCodeStyle] = useState(verifyCodeStyleDefault);
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalRequestMailVisible, setIsModalRequestMailVisible] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      setIsModalVerifyCodeVisible(false);
    }
  }

  async function sendEmail() {
    const user = await api.get('/user/me', config);
    const body = {
      isTFAEnable: true,
      tfaEmail: user.data.tfaEmail,
      tfaValidated: false,
    };
    setIsLoading(true);
    await api.patch('/user/validate-email', body, config);
    setIsLoading(false);
    setIsModalVerifyCodeVisible(true);
    setIsModalRequestMailVisible(false);
  }

  async function handleValidateCode(){
    const typedCode = document.querySelector('.tfaVerifyModal__input') as HTMLInputElement;
    const body = {
      tfaCode: typedCode.value,
      tfaValidated: false,
    };
    try{
      const validateCode = await api.patch('/user/validate-code', body, config);
      if (validateCode.status === 200){
        body.tfaValidated = true;
        setVerifyCodeStyle(verifyCodeStyleDefault);
        turnOnTFA(body, config);
        window.location.reload();
      }
    } catch (err) {
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
      {isModalRequestMailVisible &&
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
          {isLoading &&
            <div className='tfaRequestModal__loading'>
              <strong>Wait a moment...</strong>
              <TailSpin
                width='30'
                height='30'
                color='purple'
                ariaLabel='loading'
              />
            </div>
          }
        </Modal>
      }
      {isModalVerifyCodeVisible &&
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
            {isLoading &&
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
              </div>
            }
          </div>
        </Modal>
      }
    </div >
  );
}
