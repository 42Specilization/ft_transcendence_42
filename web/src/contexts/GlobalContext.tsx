import axios, { AxiosInstance } from 'axios';
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect, useMemo, useContext } from 'react';
import { GlobalData, IntraData } from '../others/Interfaces/interfaces';
import { actionsStatus } from '../adapters/status/statusState';
import { getGlobalData, getIntraData } from '../others/utils/utils';
import { ChatContext } from './ChatContext';

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

export interface UpdateUserProfile {
  change: number;
  login: string;
  newLogin?: string;
}

export interface UpdateGroupProfile {
  change: number;
  id: string;
}

interface IGlobalContext {
  config: {
    headers: {
      Authorization: string
    }
  },
  api: AxiosInstance;
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  globalData: GlobalData;
  setGlobalData: Dispatch<SetStateAction<GlobalData>>;
  updateUserProfile: UpdateUserProfile;
  setUpdateUserProfile: Dispatch<SetStateAction<UpdateUserProfile>>;
  updateGroupProfile: UpdateGroupProfile;
  setUpdateGroupProfile: Dispatch<SetStateAction<UpdateGroupProfile>>;
  closeGroupProfile: UpdateGroupProfile;
  setCloseGroupProfile: Dispatch<SetStateAction<UpdateGroupProfile>>;
}


export const GlobalContext = createContext<IGlobalContext>({
  config: {
    headers: {
      Authorization: ''
    }
  },
  api: axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  }),
  intraData: defaultIntra,
  setIntraData: () => { },
  globalData: defaultGlobal,
  setGlobalData: () => { },
  updateUserProfile: { change: Date.now(), login: '' },
  setUpdateUserProfile: () => { },
  updateGroupProfile: { change: Date.now(), id: '' },
  setUpdateGroupProfile: () => { },
  closeGroupProfile: { change: Date.now(), id: '' },
  setCloseGroupProfile: () => { },
});


interface IntraDataProviderProps {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProviderProps) => {
  const { setActiveChat } = useContext(ChatContext);
  const [intraData, setIntraData] = useState(defaultIntra);
  const [globalData, setGlobalData] = useState(defaultGlobal);
  const [
    updateUserProfile, setUpdateUserProfile
  ] = useState<UpdateUserProfile>({ change: Date.now(), login: '' });
  const [
    updateGroupProfile, setUpdateGroupProfile
  ] = useState<UpdateGroupProfile>({ change: Date.now(), id: '' });
  const [
    closeGroupProfile, setCloseGroupProfile
  ] = useState<UpdateGroupProfile>({ change: Date.now(), id: '' });

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
    actionsStatus.initializeSocketStatus(
      setIntraData,
      setGlobalData,
      setActiveChat,
      setUpdateUserProfile,
      setUpdateGroupProfile,
      setCloseGroupProfile
    );
  }, []);

  return (
    <GlobalContext.Provider value={{
      api, config,
      intraData, setIntraData,
      globalData, setGlobalData,
      updateUserProfile, setUpdateUserProfile,
      updateGroupProfile, setUpdateGroupProfile,
      closeGroupProfile, setCloseGroupProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};