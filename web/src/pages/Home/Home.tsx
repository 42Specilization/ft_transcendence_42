import './Home.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getInfos } from '../OAuth/OAuth';
import { IntraData } from '../../Interfaces/interfaces';
import axios from 'axios';

export async function getStoredData(setIntraData: Dispatch<SetStateAction<IntraData>>) {
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



export default function Home() {
  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence',
    matches: '0',
    wins: '0',
    lose: '0'
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  useEffect(() => {
    getStoredData(setIntraData);
    handleClick();
  }, []);

  let response;

  async function handleClick() {
    const token = window.localStorage.getItem('token');
    const data = new FormData();
    // data.append('name', intraData.login);
    const config = {
      // responseType:'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });
    response = await api.post('/2fa/generate', data, config);
    console.log ('resultado e', response);
  }


  return (
    <div className="home">
      <NavBar name={intraData.login} imgUrl={intraData.image_url} />
      <button onClick={handleClick}>botao</button>
      <img
        alt=""
      />
    </div >
  );
}
