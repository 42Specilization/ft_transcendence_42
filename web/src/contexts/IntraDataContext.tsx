import axios, { AxiosInstance } from 'axios';
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { IntraData } from '../others/Interfaces/interfaces';
import { actionsStatus } from '../adapters/status/statusState';
import { getIntraData } from '../others/utils/utils';

interface IIntraDataContext {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  config: {
    headers: {
      Authorization: string
    }
  },
  api: AxiosInstance
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
  friends: [],
  blocked: [],
  notify: [],
  directs: [],
  groups: [],
};

export const IntraDataContext = createContext<IIntraDataContext>({
  intraData: defaultIntra,
  setIntraData: () => { },
  config: {
    headers: {
      Authorization: ''
    }
  },
  api: axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  })
});


interface IntraDataProviderProps {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProviderProps) => {
  const [intraData, setIntraData] = useState(defaultIntra);
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    };
  }, []);

  const api = useMemo(() => axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  }), []);


  useEffect(() => {
    getIntraData(setIntraData);
    actionsStatus.initializeSocketStatus(setIntraData);
  }, []);

  return (
    <IntraDataContext.Provider value={{ intraData, setIntraData, api, config }}>
      {children}
    </IntraDataContext.Provider>
  );
};