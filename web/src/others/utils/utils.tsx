import axios from 'axios';
import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ValidateTfa } from '../../components/TFA/ValidateTfa/ValidateTfa';
import { GlobalData, IntraData } from '../Interfaces/interfaces';
import { useQuery } from 'react-query';
import { DoubleBubble } from '../../components/DoubleBubble/DoubleBubble';

export function getAccessToken() {
  return (window.localStorage.getItem('token'));
}

export function RequireAuth({ children }: any) {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  });

  function logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userData');
    window.location.href = '/signin';
  }

  (async () => {
    await api.get('/auth/validateToken', config)
      .then((isValid) => {
        if (!isValid)
          logout();
      })
      .catch(() => {
        logout();
      });
  })();

  const [isTfaValid, setIsTfaValid] = useState(false);
  const { status } = useQuery(
    'validateTfa',
    async () => {
      try {
        const user = await api.get('/user/me', config);
        if (
          user.data.isTFAEnable !== undefined &&
          user.data.isTFAEnable === false
        ) {
          setIsTfaValid(true);
          return;
        }
        if (user.data.isTFAEnable && user.data.tfaValidated !== true) {
          setIsTfaValid(false);
          return;
        }
        setIsTfaValid(true);
      } catch (error) {
        setIsTfaValid(true);
        return;
      }
    }
  );

  if (status === 'loading')
    return <DoubleBubble speed={5} customText='Loading...'></DoubleBubble>;

  if (isTfaValid === false) {
    return (
      <div>
        <ValidateTfa />
      </div>
    );
  }
  return token ? children : <Navigate to="/signin" replace />;
}

/**
 * If the token is null, then render the children, otherwise redirect to the home page.
 * @param {any}  - any
 */
export function ValidateSignin({ children }: any) {
  const token = window.localStorage.getItem('token');
  return token === null ? children : <Navigate to="/" replace />;
}

export async function getGlobalInDb() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/auth/me`, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return defaultIntra;
  }
}

export async function getGlobalDirects() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllDirects`, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getGlobalGroups() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllGroups`, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getGlobalAllUsers() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/user/getCommunity`, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getGlobalAllGroups() {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllCardGroup`, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getGlobalData(setGlobalData: Dispatch<SetStateAction<GlobalData>>) {
  const globalData: GlobalData = defaultGlobal;
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const responseGlobal = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/user/getGlobalInfos`, config);
    const responseDirects = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllDirects`, config);
    const responseGroups = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllGroups`, config);
    const responseGlobalUsers = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/user/getCommunity`, config);
    const responseGlobalGroups = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/chat/getAllCardGroup`, config);
    globalData.notify = responseGlobal.data.notify;
    globalData.friends = responseGlobal.data.friends;
    globalData.blocked = responseGlobal.data.blocked;
    globalData.directs = responseDirects.data;
    globalData.groups = responseGroups.data;
    globalData.globalUsers = responseGlobalUsers.data;
    globalData.globalGroups = responseGlobalGroups.data;
  } catch (err) {
    console.log(err);
  }
  setGlobalData(globalData);
  return globalData;
}

export async function getUserInDb(): Promise<IntraData> {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/auth/me`, config);
    const user: IntraData = response.data as IntraData;
    return (user);
  } catch (err) {
    console.log(err);
    return defaultIntra;
  }
}

export async function getIntraData(setIntraData: Dispatch<SetStateAction<IntraData>>) {
  const data = await getUserInDb();
  window.localStorage.removeItem('userData');
  window.localStorage.setItem('userData', JSON.stringify(data));
  setIntraData(data);
}

const defaultIntra: IntraData = {
  email: 'ft_transcendence@gmail.com',
  first_name: 'ft',
  image_url: 'userDefault.12345678.png',
  login: 'PingPong',
  usual_full_name: 'ft_transcendence',
  matches: '0',
  wins: '0',
  lose: '0',
  isTFAEnable: false,
  tfaValidated: false,
};

const defaultGlobal: GlobalData = {
  notify: [],
  friends: [],
  blocked: [],
  directs: [],
  groups: [],
  globalUsers: [],
  globalGroups: [],
};

export function formatDate(date: string): ReactElement {
  const newDate = new Date(date);
  return (
    <div className='chat__message__date'>
      {String(newDate.getHours()).padStart(2, '0') +
        ':' +
        String(newDate.getMinutes()).padStart(2, '0')}{' '}
      <br />
      {String(newDate.getDate()).padStart(2, '0') +
        '/' +
        String(newDate.getMonth() + 1).padStart(2, '0') +
        '/' +
        newDate.getFullYear()}
    </div>
  );
}

export function getUrlImage(url: string) {
  if (url && !url.includes('https://cdn.intra.42.fr/')) {
    if (process.env.NODE_ENV === 'production') {
      return (`/data/${url}`);
    } else {
      return (url);
    }
  } else {
    return (url);
  }
}

export function getNameLimited(name: string) {
  if (name.length > 10) {
    return (name.substring(0, 7) + '...');
  } else {
    return (name);
  }
}

export function isValidInput(str: string, minLength = 3, maxLength = 50) {
  if (!str)
    return (false);
  if (str.length < minLength || str.length > maxLength)
    return false;
  return (true);
}