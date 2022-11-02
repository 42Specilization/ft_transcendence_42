import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './ProfileCard.scss';
import { UserImage } from '../UserImage/UserImage';
import { IntraData } from '../../Interfaces/interfaces';
import { NotePencil } from 'phosphor-react';
import { Modal } from '../Modal/Modal';
import axios from 'axios';
// import QRCode from 'react-qr-code';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
    setIntraData: Dispatch<SetStateAction<IntraData>>;
}

 /**
     *
     *  o codigo que sera enviado pro email estra em data
     * preciso abrir uma janela que vai ter um novo input que vai precisar ser preenchido com o
     * codigo recebido no email
     * apos isso , o email enviado no primeiro input sera salvo no db
     *
     * No proximo login, o usuario ira receber um email com um codigo e uma tela antes da home
     *  sera exibida e aguardara que o usuario digite o codigo recebido
     *
     * Verificar como travar as outras rotas caso esse campo nao tenha sido preenchido corretamente
     */

export function ProfileCard({ email, image_url, login, full_name, setIntraData }:ProfileCardProps) {
  function handleChangeNick() {
    window.location.href = '/updateNick';
  }
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [tfaEmail, setTfaEmail] = useState<string>('');
  const [isModalVerifyCodeVisible, setIsModalVerifyCodeVisible] = useState(false);
  const [isModalTurnOnVisible, setIsModalTurnOnVisible] = useState(false);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function turnOnTFA(body:any, config :any){
    const updateTfa = await api.patch('/user/turn-on-tfa', body,config);
    if (updateTfa.status === 200){
      console.log(updateTfa);
      setIsModalVerifyCodeVisible(false);
    }
  }

  async function handleTFA() {
    setTfaEmail(emailInput.value);
    const body = {
      isTFAEnable: 'true',
      tfaEmail: tfaEmail
    };
    const validateEmail = await api.patch('/user/validate-email', body, config);
    setVerifyCode(validateEmail.data);
    setIsModalVerifyCodeVisible(true);
    setIsModalTurnOnVisible(false);

  }

  async function handleValidateCode(){
    const body = {
      isTFAEnable: 'true',
      tfaEmail: tfaEmail
    };
    const typedCode = document.querySelector('.tfaVerifyModal__input') as HTMLInputElement;
    console.log('ta aqui', typedCode.value.toString(), verifyCode.toString());

    if (typedCode.value.toString() === verifyCode.toString())
      turnOnTFA(body, config);
    else
      console.log(typeof typedCode.value);
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
        <button onClick={()=> setIsModalTurnOnVisible(true)} className='profileCard__2fa__button'  >Turn On</button>
        {
          isModalTurnOnVisible ?
            <Modal id='tfaSendMailModal' onClose={() => setIsModalTurnOnVisible(false)}>
              <h3>Insert your email to receive 2fa code</h3>
              <div className='tfaSendMailModal__inputArea' >
                <input
                  className='tfaSendMailModal__input' type="text"
                  placeholder='Type your email...'
                  onChange={(e) => {
                    setTfaEmail(e.target.value);
                  }}
                />
                <button className='tfaSendMailModal__button' onClick={handleTFA}>Turn on</button>
              </div>
            </Modal> : null
        }
        {
          isModalVerifyCodeVisible ?
            <Modal
              id='tfaVerifyModal'
              onClose={() => setIsModalVerifyCodeVisible(false)}
            >
              <h3>Insert code received in: {tfaEmail}</h3>
              <div className='tfaVerifyModal__inputArea' >
                <input
                  className='tfaVerifyModal__input' type="text"
                  placeholder='Insert Code...'

                />
                <button className='tfaVerifyModal__button' onClick={handleValidateCode}>Validate</button>
              </div>
            </Modal> : null
        }
      </div>
    </div >
  );
}
