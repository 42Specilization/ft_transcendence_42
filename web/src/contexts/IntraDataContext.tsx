import axios, { AxiosInstance } from 'axios';
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect, useMemo, useContext } from 'react';
import { GlobalData, IntraData } from '../others/Interfaces/interfaces';
import { actionsStatus } from '../adapters/status/statusState';
import { getGlobalData, getIntraData } from '../others/utils/utils';
import { ChatContext } from './ChatContext';

interface IIntraDataContext {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;

  config: {
    headers: {
      Authorization: string
    }
  },
  api: AxiosInstance

  globalData: GlobalData;
  setGlobalData: Dispatch<SetStateAction<GlobalData>>;
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
  }),

  globalData: defaultGlobal,
  setGlobalData: () => { },
});


interface IntraDataProviderProps {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProviderProps) => {

  const { setActiveChat } = useContext(ChatContext);
  const [intraData, setIntraData] = useState(defaultIntra);
  const [globalData, setGlobalData] = useState(defaultGlobal);


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
    getGlobalData(setGlobalData);
    actionsStatus.initializeSocketStatus(setIntraData, setGlobalData, setActiveChat);

  }, []);

  return (
    <IntraDataContext.Provider value={{
      intraData, setIntraData,
      api, config,
      globalData, setGlobalData,
    }}>
      {children}
    </IntraDataContext.Provider>
  );
};