import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { ErrorComponent } from '../../components/ErrorComponent/ErrorComponent';
import { NavBar } from '../../components/NavBar/NavBar';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../Home/Home';
import './ProfileUpdateNick.scss';

export default function ProfileUpdateNick() {

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
  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  const [nick, setNick] = useState<string>('');
  const [errorString, setErrorString] = useState<string>('');



  async function handleChangeNick() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };

    try {
      const result = await axios.patch(`http://${import.meta.env.VITE_API_HOST}:3000/user/updateNick`, {nick: nick}, config);
      if (result.status === 200) {
        setErrorString('');
        window.localStorage.removeItem('userData');
        getStoredData(setIntraData);
        window.location.href = '/';
        return {
          message: 'done'
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e && e.response) {
        if (e.response.data.statusCode === 403) {
          setErrorString('Usuário indisponivel');
        } else if (e.response.data.statusCode === 400) {
          setErrorString('Usuário deve conter entre 3 e 15 caracteres');
        } else {
          setErrorString('Usuário invalido');
        }
      }
    }
  }

  return (
    <>
      <div className="profileChange">
        <NavBar name={intraData.login} imgUrl={intraData.image_url} />
        <div className="profileChange__userImage" >
          <img src={intraData.image_url} alt="User Image" />
        </div>
        <div className="profileChange__input">
          <div className="profileChange__inputText">
            <strong>Digite o novo usuario:</strong>
          </div>
          <div className="profileChange__inputArea">
            <input onChange={(e) => setNick(e.target.value)} type="text"></input>
            <div className=".profileChange__inputErrors">
              <ErrorComponent defaultError={errorString} />
            </div>
          </div>
          <div>
            <button
              className="profileChange__inputButton"
              onClick={handleChangeNick}
            >
              Enviar
            </button>
          </div>
        </div>
      </div >
    </>
  );
}
