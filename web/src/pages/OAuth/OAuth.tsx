import axios from 'axios';
import { useEffect } from 'react';
import useAuth from '../../auth/auth';
import { ErrResponse, IntraData } from '../Home/Home';
import './OAuth.scss';

export async function getInfos() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  await axios('http://localhost:3000/auth/me', config).then(response => {
    const data = response.data as IntraData;
    window.localStorage.setItem('userData', JSON.stringify(data));
    return (data);
  }).catch(err => {
    const data = err.response.data as ErrResponse;
    console.log('erro aq', err);
    // if (data.statusCode == 401)
    //   navigate('/signin');
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
    <h1>hello</h1>
  );
}