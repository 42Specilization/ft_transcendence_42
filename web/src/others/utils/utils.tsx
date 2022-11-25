import axios from 'axios';
import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ValidateTfa } from '../../components/TFA/ValidateTfa/ValidateTfa';
import { DirectData, IntraData } from '../Interfaces/interfaces';
import { getInfos } from '../../pages/OAuth/OAuth';
import { useQuery } from 'react-query';
import { DoubleBubble } from '../../components/DoubleBubble/DoubleBubble';

export function getAccessToken() {
  return (window.localStorage.getItem('token'));
}

export function RequireAuth({ children }: any) {
  const token = window.localStorage.getItem('token');
  const [isTfaValid, setIsTfaValid] = useState(false);
  const { status } = useQuery(
    'validateTfa',
    async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const api = axios.create({
        baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
      });

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
export function ValidadeSignin({ children }: any) {
  const token = window.localStorage.getItem('token');
  return token === null ? children : <Navigate to="/" replace />;
}


/**
 * It gets the data from the local storage, if it doesn't exist, it gets it from the API, and if it
 * doesn't exist, it returns
 * @param setIntraData - Dispatch<SetStateAction<IntraData>>
 * @returns the data that is being parsed from the local storage.
 */
export async function getStoredData(
  setIntraData: Dispatch<SetStateAction<IntraData>>
) {
  let localStore = window.localStorage.getItem('userData');
  if (!localStore) {
    await getInfos();
    localStore = window.localStorage.getItem('userData');
    if (!localStore) return;
  }
  const data: IntraData = JSON.parse(localStore);
  setIntraData(data);
}


export async function getUserInDb(): Promise<IntraData> {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const response = await axios(`http://${import.meta.env.VITE_API_HOST}:3000/auth/me`, config);
    const user: IntraData = response.data as IntraData;
    const responseDirects = await axios.get(`http://${import.meta.env.VITE_API_HOST}:3000/chat/getAllDirects`, config);
    user.directs = responseDirects.data as DirectData[];
    // console.log('result', responseDirects);
    // console.log('user Directs', user.directs);
    return (user);
  } catch (err) {
    console.log('erro no utils getUserInDb', err);
    return defaultIntra;
  }
}


export async function getIntraData(setIntraData: Dispatch<SetStateAction<IntraData>>) {
  const data = await getUserInDb();
  window.localStorage.removeItem('userData');
  window.localStorage.setItem('userData', JSON.stringify(data));
  setIntraData(data);
}


export async function getIntraDataNotify(intraData: IntraData, setIntraData: Dispatch<SetStateAction<IntraData>>) {
  const token = window.localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  let data: IntraData;
  await axios(`http://${import.meta.env.VITE_API_HOST}:3000/auth/me`, config)
    .then(response => {
      data = response.data as IntraData;
      return (data);
    }).catch(err => {
      data = defaultIntra;
      console.log('error on getIntraData', err);
    });
  setIntraData((prevIntraData: IntraData) => {
    return { ...prevIntraData, notify: data.notify };
  });

}

export const defaultIntra: IntraData = {
  email: 'ft_transcendence@gmail.com',
  first_name: 'ft',
  image_url: 'userDefault.png',
  login: 'PingPong',
  usual_full_name: 'ft_transcendence',
  matches: '0',
  wins: '0',
  lose: '0',
  isTFAEnable: false,
  tfaValidated: false,
  friends: [],
  blockeds: [],
  notify: [],
  directs: [],
};

export function formatDate(date: string): ReactElement {
  const newDate = new Date(date);
  return (
    <>
      {String(newDate.getHours()).padStart(2, '0') +
        ':' +
        String(newDate.getMinutes()).padStart(2, '0')}{' '}
      <br />
      {String(newDate.getDate()).padStart(2, '0') +
        '/' +
        String(newDate.getMonth() + 1).padStart(2, '0') +
        '/' +
        newDate.getFullYear()}
    </>
  );
}