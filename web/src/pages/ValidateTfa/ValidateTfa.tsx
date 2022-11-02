import './ValidateTfa.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import {  useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import { Modal } from '../../components/Modal/Modal';
import axios from 'axios';
import { getStoredData } from '../Home/Home';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

export default function ValidateTfa() {
  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence',
    matches: '0',
    wins: '0',
    lose: '0',
    isTFAEnable: false,
    tfaValidated: false,

  };
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  // const [isRequestedEmail, setIsRequestedEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=> {
    getStoredData(setIntraData);
  },[]);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isModalRequestMailVisible, setIsModalRequestMailVisible] = useState(true);

  const [verifyCodeStyle, setVerifyCodeStyle] = useState(verifyCodeStyleDefault);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      console.log(updateTfa);
      setIsModalVerifyCodeVisible(false);
      setIsModalRequestMailVisible(false);
    }
  }

  /**
  * It's a function that handles the TFA (Two Factor Authentication) of the user
  * this send an email to api and receive a code, this code has been to the email and a new
  * window, for confirm the code, will open.
  */
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
    console.log(validateEmail);
    setIsModalVerifyCodeVisible(true);
    setVerifyCode(validateEmail.data);
  }
  const navigate = useNavigate();

  async function handleValidateCode(){
    const user = await api.get('/user/me', config);
    const body = {
      isTFAEnable: true,
      tfaEmail: user.data.tfaEmail,
      tfaValidated: true,
    };
    const typedCode = document.querySelector('.tfaVerifyModal__input') as HTMLInputElement;
    console.log(typedCode.value.toString(), verifyCode);
    if (typedCode.value.toString() === verifyCode.toString()){
      setVerifyCodeStyle(verifyCodeStyleDefault);
      typedCode.value = '';
      turnOnTFA(body, config);
      console.log('setou para true');
      window.localStorage.setItem('tfaValidate', 'true');

      navigate('/');
    }
    else {
      // console.log(verifyCode.toString());
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
            id='tfaVerifyModal'
          >
            <div className='tfaVerifyModal__requestArea'>
              <h3>Click to request a new code</h3>
              <button className='tfaVerifyModal__buttonRequest' onClick={sendEmail}>Send Code</button>
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
          </Modal>: null
      }
      {
        isModalVerifyCodeVisible ?
          <Modal >
            <div className='tfaVerifyModal__inputArea' >
              <input
                style={{border:verifyCodeStyle.styles.border}}
                className='tfaVerifyModal__input' type="text"
                placeholder={verifyCodeStyle.styles.placeholder}
              />
              <button className='tfaVerifyModal__button' onClick={handleValidateCode}>Validate</button>
            </div>
          </Modal> : null
      }
    </div >
  );
}
