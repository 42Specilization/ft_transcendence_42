import './TFAValidateCodeModal.scss';
import { AxiosInstance } from 'axios';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
interface TFAValidateCodeModalProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  setIsModalVerifyCodeVisible: (arg0: boolean) => void;
  isModalVerifyCodeVisible: boolean;
  tfaEmail:string
  api: AxiosInstance;
  emailInput: HTMLInputElement;
  setTfaEnable: (arg0: boolean) => void;
}

export function TFAValidateCodeModal({
  api,
  config,
  tfaEmail,
  setIsModalVerifyCodeVisible,
  isModalVerifyCodeVisible,
  setTfaEnable,


} : TFAValidateCodeModalProps){

  const verifyCodeStyleDefault = {
    styles: {
      placeholder: 'Insert Code...',
      border: '3px solid black'
    },
  };
  const [verifyCodeStyle, setVerifyCodeStyle] = useState(verifyCodeStyleDefault);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      setIsModalVerifyCodeVisible(false);
      window.location.reload();
    }
  }

  async function handleCancel(){
    const body = {
      isTFAEnable: false,
      tfaValidated: false,
      tfaEmail: null,
      tfaCode: null,
    };
    const validateEmail = await api.patch('/user/turn-off-tfa', body, config);
    setIsModalVerifyCodeVisible(false);
    if (validateEmail.status === 200){
      setTfaEnable(false);
    }
  }

  async function handleValidateCode(){
    const typedCode = document.querySelector('.tfaValidateCode__input') as HTMLInputElement;
    const body = {
      tfaCode: typedCode.value,
      tfaValidated: false,
    };
    try{
      const validateCode = await api.patch('/user/validate-code', body, config);
      console.log(validateCode);
      if (validateCode.status === 200){
        body.tfaValidated = true;
        setVerifyCodeStyle(verifyCodeStyleDefault);
        turnOnTFA(body, config);
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
    <>
      {
        isModalVerifyCodeVisible ?
          <Modal id='tfaValidateCode'>
            <h3>Insert code received in: {tfaEmail}</h3>
            <div className='tfaValidateCode__inputArea' >
              <input
                style={{border:verifyCodeStyle.styles.border}}
                className='tfaValidateCode__input' type="text"
                placeholder={verifyCodeStyle.styles.placeholder}
              />
              <div className='tfaValidateCode__buttons'>
                <button className='tfaValidateCode__buttons__validate' onClick={handleValidateCode}>Validate</button>
                <button className='tfaValidateCode__buttons__cancel' onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </Modal> : null
      }
    </>
  );
}
