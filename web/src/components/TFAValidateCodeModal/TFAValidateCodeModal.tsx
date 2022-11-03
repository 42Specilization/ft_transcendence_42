import { AxiosInstance } from 'axios';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import './TFAValidateCodeModal.scss';
interface TFAValidateCodeModalProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  setIsModalVerifyCodeVisible: (arg0: boolean) => void;
  isModalVerifyCodeVisible: boolean;
  tfaEmail:string
  api: AxiosInstance;
  emailInput: HTMLInputElement;
  verifyCode: string;
}

export function TFAValidateCodeModal({
  api,
  config,
  tfaEmail,
  setIsModalVerifyCodeVisible,
  isModalVerifyCodeVisible,
  verifyCode,

} : TFAValidateCodeModalProps){

  const verifyCodeStyleDefault = {
    styles: {
      placeholder: 'Insert Code...',
      border: '3px solid black'
    },
  };
  const [verifyCodeStyle, setVerifyCodeStyle] = useState(verifyCodeStyleDefault);


  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      // console.log(updateTfa);
      setIsModalVerifyCodeVisible(false);
      window.location.reload();
    }
  }


  async function handleValidateCode(){
    const body = {
      isTFAEnable: true,
      tfaEmail: tfaEmail,
      tfaValidated: true,
    };
    const typedCode = document.querySelector('.tfaValidateCode__input') as HTMLInputElement;
    if (typedCode.value.toString() === verifyCode.toString()){
      setVerifyCodeStyle(verifyCodeStyleDefault);
      turnOnTFA(body, config);
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
                <button className='tfaValidateCode__buttons__cancel' onClick={() => setIsModalVerifyCodeVisible(false)}>Cancel</button>
              </div>
            </div>
          </Modal> : null
      }
    </>
  );
}
