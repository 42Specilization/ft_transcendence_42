import axios from 'axios';
import { useEffect, useState } from 'react';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import { NavBar } from '../../components/NavBar/NavBar';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { IntraData } from '../../Interfaces/interfaces';
import { getInfos } from '../OAuth/OAuth';
import './ProfileUpdateNick.scss';

export default function ProfileUpdateNick(){

  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence'
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  const [nick, setNick] = useState<string>('');
  const [errorString, setErrorString] = useState<string>('');

  async function getStoredData() {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore)
        return;
    }
    const data: IntraData = JSON.parse(localStore);
    setIntraData(data);
  }

  useEffect(() => {
    getStoredData();
  }, []);


  async function handleChangeNick() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
    const input = document.querySelector('.profileChange__inputErrors') as Element;

    try {
      const result = await axios.patch(`http://${import.meta.env.VITE_API_URL}:3000/user/updateNick`, {nick:nick}, config);
      if (result.status === 200) {
        setErrorString('');
        window.localStorage.removeItem('userData');
        console.log(result.data);
        getStoredData();
        const input = document.querySelector('.profileChange__inputErrors') as Element;
        input.innerHTML = '';
        return {
          message: 'done'
        };
      }
    } catch (e) {
      if (e.response.data.statusCode === 403){
        setErrorString('Usuário indisponivel');
      } else if (e.response.data.statusCode === 400){
        setErrorString('Usuário deve conter entre 3 e 15 caracteres');
      } else {
        setErrorString('Usuário invalido');
      }
    }
  }

  return (
    <>
      <div className="profileChange">
        <NavBar name={intraData.login} imgUrl={intraData.image_url} />
        <img className="profileChange__userImage" src={intraData.image_url} alt="User Image" />
        <div>
          <div className="profileChange__inputText">
            <strong>Digite o novo usuario:</strong>
          </div>
          <div className="profileChange__inputArea">
            <input onChange={(e)=> setNick(e.target.value)} type="text"></input>
            <div className=".profileChange__inputErrors">
              <ErrorComponent defaultError={errorString}/>
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
