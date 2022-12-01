import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DoubleBubble } from '../../components/DoubleBubble/DoubleBubble';
import { ErrResponse, IntraData } from '../../others/Interfaces/interfaces';
import './OAuth.scss';

export async function getInfos() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  await axios(`http://${import.meta.env.VITE_API_HOST}:3000/auth/me`, config).then(response => {
    const data = response.data as IntraData;
    window.localStorage.setItem('userData', JSON.stringify(data));
    return (data);
  }).catch(err => {
    const data = err.response.data as ErrResponse;
    console.log('error on getInfos', err);
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
