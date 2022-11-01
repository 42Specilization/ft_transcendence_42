import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './ProfileCard.scss';
import { UserImage } from '../UserImage/UserImage';
import { IntraData } from '../../Interfaces/interfaces';
import { NotePencil } from 'phosphor-react';
import { Modal } from '../2FAModal/TFAModal';
import axios from 'axios';
import QRCode from 'react-qr-code';
interface ProfileCardProps{
    email: string;
    image_url: string;
    login: string;
    full_name: string;
    setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function ProfileCard({ email, image_url, login, full_name, setIntraData }:ProfileCardProps) {
  function handleChangeNick() {
    window.location.href = '/updateNick';
  }

  const [qrCodeLink, setQrCodeLink] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  async function handleClick() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });
    const response = await api.get('/2fa/generate', config);
    setQrCodeLink(response.statusText)
  }

  useEffect(() => {
    handleClick();
  }, []);

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
        <button onClick={()=> setIsModalVisible(true)} className='profileCard__2fa__button'  >Turn On</button>
        {
          isModalVisible ?
          <Modal onClose={() => setIsModalVisible(false)}>
          <QRCode className='tfaQrCode' value={qrCodeLink}/>
          <h3>Put the browser zoom in 100% and scan the QrCode with your phone</h3>
          </Modal> : null
        }

      </div>
    </div >
  );
}
