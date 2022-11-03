import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './ProfileCard.scss';
import { UserImage } from '../UserImage/UserImage';
import { IntraData } from '../../Interfaces/interfaces';
import { NotePencil } from 'phosphor-react';
import { Modal } from '../Modal/Modal';
import axios from 'axios';
import  {TailSpin} from 'react-loader-spinner';
import { Navigate, useNavigate } from 'react-router-dom';
// import QRCode from 'react-qr-code';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
    setIntraData: Dispatch<SetStateAction<IntraData>>;
}

/**
* Verificar como travar as outras rotas caso esse campo nao tenha sido preenchido corretamente
*/

export function ProfileCard({ email, image_url, login, full_name, setIntraData }:ProfileCardProps) {
  const navigate = useNavigate();
  function handleChangeNick() {
    navigate('/updateNick');
  }

  const [tfaEnable, setTfaEnable] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [tfaEmail, setTfaEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  const [isModalTurnOnVisible, setIsModalTurnOnVisible] = useState(false);
  const [isModalTurnOffVisible, setIsModalTurnOffVisible] = useState(false);

  const emailInput = document.querySelector('.tfaSendMailModal__input') as HTMLInputElement;

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

  const verifyMailStyleDefault = {
    styles: {
      placeholder: 'Insert your email...',
      border: '3px solid black'
    },
  };
  const [verifyMailStyle, setVerifyMailStyle] = useState(verifyMailStyleDefault);


  /**
   * It turns on two factor authentication.
   * @param {any} body - The body of the request.
   * @param {any} config - This is the configuration object that contains the headers and the baseURL.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      // console.log(updateTfa);
      setIsModalVerifyCodeVisible(false);
      window.location.reload();
    }
  }

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

  /**
  * It's a function that handles the TFA (Two Factor Authentication) of the user
  * this send an email to api and receive a code, this code has been to the email and a new
  * window, for confirm the code, will open.
  */
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
      const typedMail = document.querySelector('.tfaSendMailModal__input') as HTMLInputElement;
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


  /**
 * It takes the value of the input field, compares it to the verify code, and if it matches, it calls
 * the turnOnTFA function
 */
  async function handleValidateCode(){
    const body = {
      isTFAEnable: true,
      tfaEmail: tfaEmail,
      tfaValidated: true,
    };
    const typedCode = document.querySelector('.tfaVerifyModal__input') as HTMLInputElement;
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


  async function handleTurnOff(){
    const body = {
      isTFAEnable: false,
      tfaValidated: false,
    };
    setIsLoading(true);
    const validateEmail = await api.patch('/user/turn-on-tfa', body, config);
    setIsLoading(false);
    // console.log('validate', validateEmail);
    if (validateEmail.status === 200){
      setTfaEnable(false);
      setIsModalTurnOffVisible(false);
      return ;
    }

  }

  return (
    <div className="profileCard">
      <UserImage
        image_url={image_url}
        login={login}
        setIntraData={setIntraData}
      ></UserImage>
      <strong className="profileCard__infos__name">{full_name}</strong><br/>
      <strong className="profileCard__infos__email">{email}</strong><br/>
      <div className="profileCard__infos__nick">
        <div>
          <strong>{login}</strong>
        </div>
        <div className='profileCard__infos__button'>
          <NotePencil size={32} onClick={handleChangeNick}/>
        </div>
      </div>
      <div className="profileCard__2fa">
        <strong>2FA Authentication</strong>
        {
          !tfaEnable ?
            <button onClick={()=> setIsModalTurnOnVisible(true)} className='profileCard__2fa__button'>Turn On</button>:
            <button style={{backgroundColor:'red'}} onClick={()=>setIsModalTurnOffVisible(true)} className='profileCard__2fa__button'>Turn Off</button>
        }
        {
          isModalTurnOffVisible ?
            <Modal
              onClose={() => setIsModalTurnOffVisible(false)}>
              <h3> Are you sure you want to disable 2fa ?</h3>
              <div className="tfaDesable__buttons">
                <button className="tfaDesable__button__confirm" onClick={handleTurnOff}>Confirm</button>
                <button className="tfaDesable__button__cancel" onClick={()=> setIsModalTurnOffVisible(false)}>Cancel</button>
              </div>
            </Modal> : null
        }
        {
          isModalTurnOnVisible ?
            <Modal id='tfaSendMailModal' onClose={() => setIsModalTurnOnVisible(false)}>
              <h3>Insert your email to receive 2fa code</h3>
              <div className='tfaSendMailModal__inputArea' >
                <input
                  style={{border:verifyMailStyle.styles.border}}
                  className='tfaSendMailModal__input' type="text"
                  placeholder={verifyMailStyle.styles.placeholder}
                  onChange={(e) => {
                    setTfaEmail(e.target.value);
                  }}
                />
                <button className='tfaSendMailModal__button' onClick={handleTFA}>Turn on</button>
              </div>
              {
                isLoading ?
                  <div className='tfaLoading'>
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
        {
          isModalVerifyCodeVisible ?
            <Modal
              id='tfaVerifyModal'
            >
              <h3>Insert code received in: {tfaEmail}</h3>
              <div className='tfaVerifyModal__inputArea' >
                <input
                  style={{border:verifyCodeStyle.styles.border}}
                  className='tfaVerifyModal__input' type="text"
                  placeholder={verifyCodeStyle.styles.placeholder}
                />
                <button className='tfaVerifyModal__button' onClick={handleValidateCode}>Validate</button>
                <button className='tfaVerifyModal__buttonCancel' onClick={() => setIsModalVerifyCodeVisible(false)}>Cancel</button>
              </div>
            </Modal> : null
        }
      </div>
    </div >
  );
}
