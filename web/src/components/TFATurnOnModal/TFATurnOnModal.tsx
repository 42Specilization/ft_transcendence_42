import { AxiosInstance } from 'axios';
import { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Modal } from '../Modal/Modal';
import './TFATurnOnModal.scss';
interface TFATurnOnModalProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  setIsModalTurnOnVisible: (arg0: boolean) => void;
  isModalTurnOnVisible:boolean;
  setTfaEmail: (arg0: string) => void;
  tfaEmail:string
  api: AxiosInstance;
  emailInput: HTMLInputElement;
  setVerifyCode: (arg0: string) => void;
  setIsModalVerifyCodeVisible: (arg0: boolean) => void;
}

export function TFATurnOnModal({
  setIsModalTurnOnVisible,
  isModalTurnOnVisible,
  api,
  config,
  setTfaEmail,
  tfaEmail,
  emailInput,
  setVerifyCode,
  setIsModalVerifyCodeVisible,
} : TFATurnOnModalProps){

  const verifyMailStyleDefault = {
    styles: {
      placeholder: 'Insert your email...',
      border: '3px solid black'
    },
  };
  const [verifyMailStyle, setVerifyMailStyle] = useState(verifyMailStyleDefault);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTFA() {
    setTfaEmail(emailInput.value);
    const body = {
      isTFAEnable: true,
      tfaEmail: tfaEmail,
      tfaValidated: true,
    };
    try {
      setVerifyMailStyle(verifyMailStyleDefault);
      setIsLoading(true);
      const validateEmail = await api.patch('/user/validate-email', body, config);
      setIsLoading(false);
      console.log('validate', validateEmail);
      if (validateEmail.status === 200){
        setVerifyCode(validateEmail.data);
        setIsModalVerifyCodeVisible(true);
        setIsModalTurnOnVisible(false);
      }
    } catch (error) {
      setIsLoading(false);
      const typedMail = document.querySelector('.tfaTurnON__input') as HTMLInputElement;
      typedMail.value = '';
      const errorVefify = {
        styles: {
          placeholder: 'Invalid Mail',
          border: '3px solid red'
        },
      };
      setVerifyMailStyle(errorVefify);
    }
  }

  return (
    <>
      {
        isModalTurnOnVisible ?
          <Modal id='tfaTurnOn' onClose={() => setIsModalTurnOnVisible(false)}>
            <h3>Insert your email to receive 2fa code</h3>
            <div className='tfaTurnOn__inputArea' >
              <input
                style={{border:verifyMailStyle.styles.border}}
                className='tfaTurnOn__input' type="text"
                placeholder={verifyMailStyle.styles.placeholder}
                onChange={(e) => {
                  setTfaEmail(e.target.value);
                }}
              />
              <button className='tfaTurnOn__button' onClick={handleTFA}>Turn on</button>
            </div>
            {
              isLoading ?
                <div className='tfaTurnOn__loading'>
                  <strong>Wait a moment</strong>
                  <TailSpin
                    width='30'
                    height='30'
                    color='purple'
                    ariaLabel='loading'
                  />
                </div> : null
            }
          </Modal> : null
      }
    </>
  );
}
