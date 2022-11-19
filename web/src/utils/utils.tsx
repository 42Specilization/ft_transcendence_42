import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ValidateTfa } from '../components/ValidateTfa/ValidateTfa';
import { IntraData } from '../Interfaces/interfaces';
import { getInfos } from '../pages/OAuth/OAuth';

export function getAccessToken() {
  return (window.localStorage.getItem('token'));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RequireAuth({ children }: any) {
  const token = window.localStorage.getItem('token');
  const [isTfaValid, setIsTfaValid] = useState(false);

  /**
   * It checks if the user has TFA enabled, if not, it sets the isTfaValid state to true. If the user has
   * TFA enabled, it checks if the user has validated TFA, if not, it sets the isTfaValid state to false.
   * If the user has TFA enabled and has validated TFA, it sets the isTfaValid state to true
   * @returns a boolean value.
   */
  async function validateTFA() {
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

  validateTFA();

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  image_url: 'nop',
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
