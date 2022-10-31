import axios from 'axios';
import { useEffect } from 'react';
import useAuth from '../../auth/auth';
import { DoubleBubble } from '../../components/DoubleBubble/DoubleBubble';
import { ErrResponse, IntraData } from '../../Interfaces/interfaces';
import './OAuth.scss';

export async function getInfos() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  console.log('config', config)
  await axios(`http://${import.meta.env.VITE_API_HOST}:3000/auth/me`, config).then(response => {
    console.log('aqui');
    const data = response.data as IntraData;
    console.log('response', response.data);
    window.localStorage.setItem('userData', JSON.stringify(data));
    return (data);
  }).catch(err => {
    const data = err.response.data as ErrResponse;

    console.log('data', data);
    // console.log('erro aq', err);
    if (data.statusCode == 401 && process.env.NODE_ENV == 'production')
      window.location.pathname = '/signin';
  }

  );
}

export default function OAuth() {

  const { login } = useAuth();

  async function handleLogin() {
    await login();
    await getInfos();
  }

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <DoubleBubble speed={5} customText='Loading...'></DoubleBubble>
  );
}
